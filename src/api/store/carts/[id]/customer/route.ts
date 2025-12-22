import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * POST /store/carts/:id/customer
 * Associe un cart à un customer authentifié
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const cartId = req.params.id

  // Récupérer le customer depuis l'auth
  const authIdentity = (req as any).auth_context?.auth_identity_id

  if (!authIdentity) {
    return res.status(401).json({
      message: "Authentication required",
    })
  }

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Récupérer le customer lié à l'auth identity
    const { data: authIdentities } = await query.graph({
      entity: "auth_identity",
      fields: ["app_metadata"],
      filters: { id: authIdentity },
    })

    const customerId = authIdentities[0]?.app_metadata?.customer_id

    if (!customerId) {
      return res.status(400).json({
        message: "No customer linked to this auth identity",
      })
    }

    // Mettre à jour le cart avec le customer_id via le service
    const cartService = req.scope.resolve("cart")

    await cartService.updateCarts([{
      id: cartId,
      customer_id: customerId,
    }])

    // Récupérer le cart mis à jour
    const { data: carts } = await query.graph({
      entity: "cart",
      fields: ["id", "customer_id"],
      filters: { id: cartId },
    })

    console.log(`[Cart] Associated cart ${cartId} with customer ${customerId}`)

    return res.json({
      cart: carts[0],
    })
  } catch (error) {
    console.error("[Cart] Error associating customer:", error)
    return res.status(500).json({
      message: "Failed to associate cart with customer",
    })
  }
}
