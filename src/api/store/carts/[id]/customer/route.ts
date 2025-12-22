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

  // Dans Medusa v2, actor_id contient directement le customer_id pour les routes store
  const customerId = (req as any).auth_context?.actor_id

  console.log("[Cart/Customer] Request received")
  console.log("[Cart/Customer] Cart ID:", cartId)
  console.log("[Cart/Customer] auth_context:", JSON.stringify((req as any).auth_context))
  console.log("[Cart/Customer] Customer ID (actor_id):", customerId)

  if (!customerId) {
    return res.status(401).json({
      message: "Authentication required - no customer ID found",
    })
  }

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

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

    console.log(`[Cart/Customer] SUCCESS - Associated cart ${cartId} with customer ${customerId}`)

    return res.json({
      cart: carts[0],
    })
  } catch (error) {
    console.error("[Cart/Customer] Error associating customer:", error)
    return res.status(500).json({
      message: "Failed to associate cart with customer",
    })
  }
}
