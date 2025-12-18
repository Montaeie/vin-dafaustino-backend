import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { auditService, AuditEventType } from "../../../../../modules/audit"

// POST /admin/audit/:customer_id/anonymize - Anonymise les données d'un client (RGPD - Droit à l'oubli)
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { customer_id } = req.params

    // Log la demande d'anonymisation avant l'anonymisation
    await auditService.log({
      event_type: AuditEventType.DATA_DELETE_REQUEST,
      customer_id,
      metadata: {
        requested_by: "admin",
        timestamp: new Date().toISOString(),
        action: "anonymize",
      },
    })

    // Anonymiser les données
    await auditService.anonymizeCustomerData(customer_id)

    res.json({
      success: true,
      customer_id,
      message: "Les données du client ont été anonymisées avec succès",
      anonymized_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Admin Audit Anonymize API] Error:", error)
    res.status(500).json({ error: "Erreur lors de l'anonymisation des données" })
  }
}
