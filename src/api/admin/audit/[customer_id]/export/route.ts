import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { auditService, AuditEventType } from "../../../../../modules/audit"

// GET /admin/audit/:customer_id/export - Exporte toutes les données d'audit d'un client (RGPD)
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { customer_id } = req.params

    // Log l'export pour traçabilité RGPD
    await auditService.log({
      event_type: AuditEventType.DATA_EXPORT_REQUEST,
      customer_id,
      metadata: {
        requested_by: "admin",
        timestamp: new Date().toISOString(),
      },
    })

    const logs = await auditService.exportCustomerData(customer_id)

    res.json({
      customer_id,
      export_date: new Date().toISOString(),
      total_entries: logs.length,
      logs,
    })
  } catch (error) {
    console.error("[Admin Audit Export API] Error:", error)
    res.status(500).json({ error: "Erreur lors de l'export des données" })
  }
}
