import {
  updateCartPromotionsWorkflow,
  completeCartWorkflow,
} from "@medusajs/medusa/core-flows"
import { MedusaError } from "@medusajs/framework/utils"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// Code promo réservé aux nouveaux clients (première commande)
const FIRST_PURCHASE_PROMO_CODES = ["LAPLACE10"]

/**
 * Hook de validation lors de l'ajout de promotions au panier
 * Vérifie que le client est connecté et n'a jamais passé de commande
 */
updateCartPromotionsWorkflow.hooks.validate(
  async ({ input, cart }, { container }) => {
    // Vérifier si le code LAPLACE10 est dans les codes appliqués
    const promoCodesInput = input?.promo_codes || []
    const hasFirstPurchaseCode = promoCodesInput.some((code: string) =>
      FIRST_PURCHASE_PROMO_CODES.includes(code.toUpperCase())
    )

    if (!hasFirstPurchaseCode) {
      return // Pas notre code promo, laisser passer
    }

    console.log("[LAPLACE10] Validating first purchase promo code...")

    // 1. Vérifier que le panier a un client associé
    if (!cart?.customer_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Le code LAPLACE10 est réservé aux nouveaux clients. Veuillez créer un compte pour l'utiliser."
      )
    }

    // 2. Récupérer les données du client
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "has_account", "orders.*"],
      filters: { id: cart.customer_id },
    })

    const customer = customers[0]

    if (!customer) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Le code LAPLACE10 est réservé aux nouveaux clients. Veuillez créer un compte pour l'utiliser."
      )
    }

    // 3. Vérifier que le client a un compte (pas un guest)
    if (!customer.has_account) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Le code LAPLACE10 est réservé aux nouveaux clients. Veuillez créer un compte pour l'utiliser."
      )
    }

    // 4. Vérifier que le client n'a pas de commandes précédentes
    const orders = customer.orders || []
    if (orders.length > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Le code LAPLACE10 est réservé à votre première commande uniquement."
      )
    }

    console.log("[LAPLACE10] Validation passed - first purchase confirmed")
  }
)

/**
 * Hook de validation finale lors de la complétion du panier
 * Double vérification avant la création de la commande
 */
completeCartWorkflow.hooks.validate(
  async ({ input, cart }, { container }) => {
    // Vérifier si le panier a des promotions LAPLACE10 appliquées
    const appliedCodes = cart?.promotions?.map((p: any) => p.code?.toUpperCase()) || []
    const hasFirstPurchaseCode = appliedCodes.some((code: string) =>
      FIRST_PURCHASE_PROMO_CODES.includes(code)
    )

    if (!hasFirstPurchaseCode) {
      return // Pas notre code promo
    }

    console.log("[LAPLACE10] Final validation before order completion...")

    // Même vérification que ci-dessus pour être sûr
    if (!cart?.customer_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Le code LAPLACE10 ne peut pas être utilisé sans compte client."
      )
    }

    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "has_account", "orders.*"],
      filters: { id: cart.customer_id },
    })

    const customer = customers[0]

    if (!customer?.has_account) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Le code LAPLACE10 est réservé aux comptes clients."
      )
    }

    const orders = customer.orders || []
    if (orders.length > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Le code LAPLACE10 n'est valide que pour la première commande."
      )
    }

    console.log("[LAPLACE10] Final validation passed")
  }
)
