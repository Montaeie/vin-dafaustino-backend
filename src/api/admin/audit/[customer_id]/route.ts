import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { auditService } from "../../../../modules/audit"

// GET /admin/audit/:customer_id - Récupère les logs d'un client spécifique
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { customer_id } = req.params
    const { limit = "50" } = req.query as Record<string, string>

    const logs = await auditService.getLogsByCustomerId(
      customer_id,
      parseInt(limit, 10)
    )

    res.json({ logs, customer_id })
  } catch (error) {
    console.error("[Admin Audit API] Error:", error)
    res.status(500).json({ error: "Erreur lors de la récupération des logs" })
  }
}
