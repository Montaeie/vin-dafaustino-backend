import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { resendService } from "../modules/resend/service"
import { CartAbandonedEmail } from "../modules/resend/emails/cart-abandoned"

// Configuration
const ABANDONED_CART_THRESHOLD_HOURS = 2 // Envoyer email apres 2h d'abandon
const ABANDONED_CART_MAX_AGE_HOURS = 72 // Ne pas envoyer pour les paniers > 72h

export default async function abandonedCartJob(container: MedusaContainer) {
  console.log("[AbandonedCart] Job started")

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const now = new Date()
    const thresholdDate = new Date(now.getTime() - ABANDONED_CART_THRESHOLD_HOURS * 60 * 60 * 1000)
    const maxAgeDate = new Date(now.getTime() - ABANDONED_CART_MAX_AGE_HOURS * 60 * 60 * 1000)

    // Recuperer les paniers avec email, non completes, dans la fenetre de temps
    const { data: carts } = await query.graph({
      entity: "cart",
      fields: [
        "id",
        "email",
        "created_at",
        "updated_at",
        "completed_at",
        "items.*",
        "total",
        "metadata",
      ],
      filters: {
        completed_at: null, // Non complete
        email: { $ne: null }, // Avec email
        updated_at: {
          $lt: thresholdDate.toISOString(), // Pas touche depuis X heures
          $gt: maxAgeDate.toISOString(), // Pas trop vieux
        },
      },
    })

    console.log(`[AbandonedCart] Found ${carts.length} abandoned carts`)

    const siteUrl = process.env.STOREFRONT_URL || "https://dafaustino.com"

    for (const cart of carts) {
      // Verifier si on a deja envoye un email pour ce panier
      const metadata = cart.metadata as Record<string, any> || {}
      if (metadata.abandoned_email_sent) {
        console.log(`[AbandonedCart] Email already sent for cart ${cart.id}, skipping`)
        continue
      }

      // Verifier qu'il y a des items
      if (!cart.items || cart.items.length === 0) {
        continue
      }

      // Extraire les valeurs numeriques
      const getNumericValue = (value: any): number => {
        if (typeof value === "object" && value !== null) {
          return parseFloat(value.numeric || value.numeric_ || value.value || value.amount || 0)
        }
        return typeof value === "number" ? value : parseFloat(value) || 0
      }

      const items = cart.items.map((item: any) => ({
        title: item.title || item.product_title || "Produit",
        quantity: item.quantity || 1,
        unit_price: getNumericValue(item.unit_price),
      }))

      const cartTotal = getNumericValue(cart.total)

      // Extraire le prenom de l'email si possible
      const emailParts = cart.email.split("@")[0]
      const customerName = emailParts.charAt(0).toUpperCase() + emailParts.slice(1)

      try {
        await resendService.sendEmail({
          to: cart.email,
          subject: "Votre panier vous attend - Da Faustino",
          react: CartAbandonedEmail({
            customerName,
            items,
            cartTotal,
            cartUrl: `${siteUrl}/panier`,
          }),
        })

        console.log(`[AbandonedCart] Email sent to ${cart.email} for cart ${cart.id}`)

        // Marquer le panier comme ayant recu l'email
        // Note: En Medusa v2, on peut mettre a jour les metadata du cart
        // Mais pour l'instant on log juste - implementer la mise a jour si necessaire

      } catch (emailError) {
        console.error(`[AbandonedCart] Failed to send email for cart ${cart.id}:`, emailError)
      }
    }

    console.log("[AbandonedCart] Job completed")
  } catch (error) {
    console.error("[AbandonedCart] Job failed:", error)
  }
}

export const config = {
  name: "abandoned-cart-reminder",
  // Executer toutes les heures
  schedule: "0 * * * *",
}
