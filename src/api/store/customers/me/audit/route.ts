import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { auditService } from "../../../../../modules/audit"

// GET /store/customers/me/audit - Récupère les logs d'audit du client connecté (RGPD)
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    // Récupérer le client connecté depuis le contexte d'auth
    const authIdentity = (req as any).auth_context?.actor_id

    if (!authIdentity) {
      return res.status(401).json({ error: "Non authentifié" })
    }

    // Récupérer le customer_id à partir de l'auth identity
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "email"],
      filters: {
        // Dans Medusa v2, l'auth_identity est lié au customer
        id: authIdentity
      },
    })

    const customer = customers[0]

    if (!customer) {
      return res.status(404).json({ error: "Client non trouvé" })
    }

    const { limit = "50" } = req.query as Record<string, string>

    // Récupérer les logs par customer_id ou email
    let logs = await auditService.getLogsByCustomerId(
      customer.id,
      parseInt(limit, 10)
    )

    // Si pas de logs par ID, essayer par email
    if (logs.length === 0 && customer.email) {
      logs = await auditService.getLogsByEmail(
        customer.email,
        parseInt(limit, 10)
      )
    }

    res.json({
      logs,
      customer_id: customer.id,
      total: logs.length,
    })
  } catch (error) {
    console.error("[Store Audit API] Error:", error)
    res.status(500).json({ error: "Erreur lors de la récupération des logs" })
  }
}
