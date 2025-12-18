import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { auditService, AuditEventType } from "../../../modules/audit"

// GET /admin/audit - Liste tous les logs d'audit (paginé)
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const {
      limit = "50",
      offset = "0",
      event_type,
      customer_id,
      start_date,
      end_date,
    } = req.query as Record<string, string>

    const options: {
      limit?: number
      offset?: number
      eventType?: AuditEventType
      customerId?: string
      startDate?: Date
      endDate?: Date
    } = {
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    }

    if (event_type && Object.values(AuditEventType).includes(event_type as AuditEventType)) {
      options.eventType = event_type as AuditEventType
    }
    if (customer_id) {
      options.customerId = customer_id
    }
    if (start_date) {
      options.startDate = new Date(start_date)
    }
    if (end_date) {
      options.endDate = new Date(end_date)
    }

    const { logs, total } = await auditService.getAllLogs(options)

    res.json({
      logs,
      total,
      limit: options.limit,
      offset: options.offset,
    })
  } catch (error) {
    console.error("[Admin Audit API] Error:", error)
    res.status(500).json({ error: "Erreur lors de la récupération des logs d'audit" })
  }
}
