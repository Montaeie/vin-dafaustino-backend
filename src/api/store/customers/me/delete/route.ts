import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { auditService, AuditEventType } from "../../../../../modules/audit"

// DELETE /store/customers/me/delete - Supprime le compte client
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  // Vérifier l'authentification
  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({
      message: "Non autorisé. Veuillez vous connecter.",
    })
  }

  // Extraire les informations pour l'audit
  const ipAddress =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    (req.headers["x-real-ip"] as string) ||
    req.socket?.remoteAddress ||
    "unknown"
  const userAgent = req.headers["user-agent"] || "unknown"

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Récupérer les infos du client avant suppression pour l'audit
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "email", "first_name", "last_name"],
      filters: { id: customerId },
    })

    const customer = customers[0]
    if (!customer) {
      return res.status(404).json({
        message: "Client non trouvé.",
      })
    }

    // Supprimer le client via Medusa
    const customerModuleService = req.scope.resolve("customer")
    await customerModuleService.deleteCustomers([customerId])

    // Logger l'événement d'audit
    await auditService.log({
      event_type: AuditEventType.ACCOUNT_DELETED,
      customer_id: customerId,
      customer_email: customer.email || undefined,
      ip_address: ipAddress,
      user_agent: userAgent,
      metadata: {
        deleted_at: new Date().toISOString(),
        first_name: customer.first_name,
        last_name: customer.last_name,
      },
    })

    // Anonymiser les données d'audit existantes (RGPD)
    await auditService.anonymizeCustomerData(customerId)

    res.status(200).json({
      success: true,
      message: "Votre compte a été supprimé avec succès.",
    })
  } catch (error) {
    console.error("[Customer Delete] Error:", error)

    // Logger l'échec
    await auditService.log({
      event_type: AuditEventType.ACCOUNT_DELETED,
      customer_id: customerId,
      ip_address: ipAddress,
      user_agent: userAgent,
      metadata: {
        error: true,
        error_message: error instanceof Error ? error.message : "Unknown error",
      },
    })

    res.status(500).json({
      message: "Une erreur est survenue lors de la suppression du compte.",
    })
  }
}
