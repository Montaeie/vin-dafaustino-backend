import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { auditService, AuditEventType } from "../../../../../modules/audit"

interface PasswordUpdateBody {
  current_password: string
  new_password: string
}

// POST /store/customers/me/password - Met à jour le mot de passe du client
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  // Vérifier l'authentification
  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({
      message: "Non autorisé. Veuillez vous connecter.",
    })
  }

  const { current_password, new_password } = req.body as PasswordUpdateBody

  // Validation
  if (!current_password || !new_password) {
    return res.status(400).json({
      message: "Le mot de passe actuel et le nouveau mot de passe sont requis.",
    })
  }

  if (new_password.length < 8) {
    return res.status(400).json({
      message: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
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

    // Récupérer les infos du client
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "email"],
      filters: { id: customerId },
    })

    const customer = customers[0]
    if (!customer) {
      return res.status(404).json({
        message: "Client non trouvé.",
      })
    }

    // Vérifier le mot de passe actuel en tentant une authentification via l'API
    const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

    const authCheckResponse = await fetch(`${MEDUSA_BACKEND_URL}/auth/customer/emailpass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customer.email,
        password: current_password,
      }),
    })

    if (!authCheckResponse.ok) {
      return res.status(400).json({
        message: "Le mot de passe actuel est incorrect.",
      })
    }

    // Mettre à jour le mot de passe via l'auth identity
    // Dans Medusa v2, on doit récupérer l'auth_identity et mettre à jour le provider
    const authModule = req.scope.resolve("auth")

    // Récupérer l'auth identity liée au customer
    const { data: authIdentities } = await query.graph({
      entity: "auth_identity",
      fields: ["id", "provider_identities.*"],
      filters: {
        app_metadata: {
          customer_id: customerId
        }
      }
    })

    if (!authIdentities || authIdentities.length === 0) {
      return res.status(400).json({
        message: "Impossible de mettre à jour le mot de passe. Veuillez utiliser la réinitialisation par email.",
      })
    }

    const authIdentity = authIdentities[0]
    const providerIdentity = authIdentity.provider_identities?.find(
      (pi: any) => pi.provider === "emailpass"
    )

    if (!providerIdentity) {
      return res.status(400).json({
        message: "Impossible de mettre à jour le mot de passe. Veuillez utiliser la réinitialisation par email.",
      })
    }

    // Mettre à jour le mot de passe
    await authModule.updateProviderIdentities([{
      id: providerIdentity.id,
      provider_metadata: {
        password: new_password,
      },
    }])

    // Logger l'événement d'audit
    await auditService.log({
      event_type: AuditEventType.PASSWORD_CHANGED,
      customer_id: customerId,
      customer_email: customer.email,
      ip_address: ipAddress,
      user_agent: userAgent,
      metadata: {
        changed_at: new Date().toISOString(),
      },
    })

    res.status(200).json({
      success: true,
      message: "Mot de passe mis à jour avec succès.",
    })
  } catch (error) {
    console.error("[Password Update] Error:", error)

    // En cas d'erreur, suggérer la réinitialisation par email
    res.status(500).json({
      message: "Pour modifier votre mot de passe, veuillez utiliser la fonction \"Mot de passe oublié\" sur la page de connexion.",
    })
  }
}
