import { Pool } from "pg"

// Types d'événements d'audit
export enum AuditEventType {
  // Authentification
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILED = "LOGIN_FAILED",
  LOGOUT = "LOGOUT",
  PASSWORD_RESET_REQUEST = "PASSWORD_RESET_REQUEST",
  PASSWORD_RESET_SUCCESS = "PASSWORD_RESET_SUCCESS",
  PASSWORD_CHANGED = "PASSWORD_CHANGED",

  // Compte
  ACCOUNT_CREATED = "ACCOUNT_CREATED",
  ACCOUNT_UPDATED = "ACCOUNT_UPDATED",
  ACCOUNT_DELETED = "ACCOUNT_DELETED",

  // Adresses
  ADDRESS_ADDED = "ADDRESS_ADDED",
  ADDRESS_UPDATED = "ADDRESS_UPDATED",
  ADDRESS_DELETED = "ADDRESS_DELETED",

  // Commandes
  ORDER_PLACED = "ORDER_PLACED",
  ORDER_CANCELLED = "ORDER_CANCELLED",

  // RGPD
  DATA_EXPORT_REQUEST = "DATA_EXPORT_REQUEST",
  DATA_DELETE_REQUEST = "DATA_DELETE_REQUEST",
  CONSENT_GIVEN = "CONSENT_GIVEN",
  CONSENT_WITHDRAWN = "CONSENT_WITHDRAWN",
}

export interface AuditLogEntry {
  id?: string
  event_type: AuditEventType
  customer_id?: string
  customer_email?: string
  ip_address?: string
  user_agent?: string
  metadata?: Record<string, unknown>
  created_at?: Date
}

// Singleton pool
let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  }
  return pool
}

export class AuditService {
  private initialized = false

  async initialize(): Promise<void> {
    if (this.initialized) return

    const client = await getPool().connect()
    try {
      // Créer la table d'audit si elle n'existe pas
      await client.query(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          event_type VARCHAR(50) NOT NULL,
          customer_id VARCHAR(255),
          customer_email VARCHAR(255),
          ip_address VARCHAR(45),
          user_agent TEXT,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

          -- Index pour les recherches fréquentes
          CONSTRAINT audit_logs_event_type_check CHECK (event_type IS NOT NULL)
        );

        -- Index pour les requêtes courantes
        CREATE INDEX IF NOT EXISTS idx_audit_logs_customer_id ON audit_logs(customer_id);
        CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
        CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON audit_logs(ip_address);
      `)

      this.initialized = true
      console.log("[AuditService] Table audit_logs initialisée avec succès")
    } catch (error) {
      console.error("[AuditService] Erreur lors de l'initialisation:", error)
      throw error
    } finally {
      client.release()
    }
  }

  async log(entry: AuditLogEntry): Promise<string | null> {
    await this.initialize()

    const client = await getPool().connect()
    try {
      const result = await client.query(
        `INSERT INTO audit_logs (event_type, customer_id, customer_email, ip_address, user_agent, metadata)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
          entry.event_type,
          entry.customer_id || null,
          entry.customer_email || null,
          entry.ip_address || null,
          entry.user_agent || null,
          JSON.stringify(entry.metadata || {}),
        ]
      )

      const logId = result.rows[0]?.id
      console.log(`[AuditService] Event logged: ${entry.event_type} (${logId})`)
      return logId
    } catch (error) {
      console.error("[AuditService] Erreur lors du logging:", error)
      return null
    } finally {
      client.release()
    }
  }

  async getLogsByCustomerId(customerId: string, limit = 50): Promise<AuditLogEntry[]> {
    await this.initialize()

    const client = await getPool().connect()
    try {
      const result = await client.query(
        `SELECT * FROM audit_logs
         WHERE customer_id = $1
         ORDER BY created_at DESC
         LIMIT $2`,
        [customerId, limit]
      )
      return result.rows
    } finally {
      client.release()
    }
  }

  async getLogsByEmail(email: string, limit = 50): Promise<AuditLogEntry[]> {
    await this.initialize()

    const client = await getPool().connect()
    try {
      const result = await client.query(
        `SELECT * FROM audit_logs
         WHERE customer_email = $1
         ORDER BY created_at DESC
         LIMIT $2`,
        [email, limit]
      )
      return result.rows
    } finally {
      client.release()
    }
  }

  async getFailedLoginAttempts(ipAddress: string, since: Date): Promise<number> {
    await this.initialize()

    const client = await getPool().connect()
    try {
      const result = await client.query(
        `SELECT COUNT(*) as count FROM audit_logs
         WHERE ip_address = $1
         AND event_type = $2
         AND created_at > $3`,
        [ipAddress, AuditEventType.LOGIN_FAILED, since]
      )
      return parseInt(result.rows[0]?.count || "0", 10)
    } finally {
      client.release()
    }
  }

  async getRecentLogsByType(
    eventType: AuditEventType,
    limit = 100
  ): Promise<AuditLogEntry[]> {
    await this.initialize()

    const client = await getPool().connect()
    try {
      const result = await client.query(
        `SELECT * FROM audit_logs
         WHERE event_type = $1
         ORDER BY created_at DESC
         LIMIT $2`,
        [eventType, limit]
      )
      return result.rows
    } finally {
      client.release()
    }
  }

  async getAllLogs(options: {
    limit?: number
    offset?: number
    eventType?: AuditEventType
    customerId?: string
    startDate?: Date
    endDate?: Date
  } = {}): Promise<{ logs: AuditLogEntry[]; total: number }> {
    await this.initialize()

    const {
      limit = 50,
      offset = 0,
      eventType,
      customerId,
      startDate,
      endDate,
    } = options

    const conditions: string[] = []
    const params: (string | Date | number)[] = []
    let paramIndex = 1

    if (eventType) {
      conditions.push(`event_type = $${paramIndex++}`)
      params.push(eventType)
    }
    if (customerId) {
      conditions.push(`customer_id = $${paramIndex++}`)
      params.push(customerId)
    }
    if (startDate) {
      conditions.push(`created_at >= $${paramIndex++}`)
      params.push(startDate)
    }
    if (endDate) {
      conditions.push(`created_at <= $${paramIndex++}`)
      params.push(endDate)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    const client = await getPool().connect()
    try {
      // Get total count
      const countResult = await client.query(
        `SELECT COUNT(*) as count FROM audit_logs ${whereClause}`,
        params
      )
      const total = parseInt(countResult.rows[0]?.count || "0", 10)

      // Get paginated logs
      const logsResult = await client.query(
        `SELECT * FROM audit_logs ${whereClause}
         ORDER BY created_at DESC
         LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
        [...params, limit, offset]
      )

      return { logs: logsResult.rows, total }
    } finally {
      client.release()
    }
  }

  // RGPD: Exporter toutes les données d'un client
  async exportCustomerData(customerId: string): Promise<AuditLogEntry[]> {
    return this.getLogsByCustomerId(customerId, 1000)
  }

  // RGPD: Anonymiser les données d'un client
  async anonymizeCustomerData(customerId: string): Promise<void> {
    await this.initialize()

    const client = await getPool().connect()
    try {
      await client.query(
        `UPDATE audit_logs
         SET customer_email = 'anonymized@deleted.user',
             ip_address = '0.0.0.0',
             user_agent = 'anonymized',
             metadata = '{}'
         WHERE customer_id = $1`,
        [customerId]
      )
      console.log(`[AuditService] Données anonymisées pour le client ${customerId}`)
    } finally {
      client.release()
    }
  }
}

// Singleton
export const auditService = new AuditService()
