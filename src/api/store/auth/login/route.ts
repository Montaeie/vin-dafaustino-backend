import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { auditService, AuditEventType } from "../../../../modules/audit"

// POST /store/auth/login - Wrapper pour le login avec audit logging
// Note: Ce endpoint est utilisé en plus de l'auth native de Medusa
// pour logger les tentatives de connexion
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, success, customer_id } = req.body as {
    email?: string
    success: boolean
    customer_id?: string
  }

  // Extraire les informations de la requête
  const ipAddress =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.headers["x-real-ip"] as string ||
    req.socket?.remoteAddress ||
    "unknown"

  const userAgent = req.headers["user-agent"] || "unknown"

  try {
    if (success && customer_id) {
      // Login réussi
      await auditService.log({
        event_type: AuditEventType.LOGIN_SUCCESS,
        customer_id,
        customer_email: email,
        ip_address: ipAddress,
        user_agent: userAgent,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      })
    } else {
      // Login échoué
      await auditService.log({
        event_type: AuditEventType.LOGIN_FAILED,
        customer_email: email,
        ip_address: ipAddress,
        user_agent: userAgent,
        metadata: {
          timestamp: new Date().toISOString(),
          reason: "invalid_credentials",
        },
      })
    }

    res.json({ logged: true })
  } catch (error) {
    console.error("[Auth Login Audit] Error:", error)
    // Ne pas bloquer le login en cas d'erreur de logging
    res.json({ logged: false, error: "audit_error" })
  }
}
