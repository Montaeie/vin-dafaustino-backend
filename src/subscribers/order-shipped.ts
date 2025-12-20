import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { resendService } from "../modules/resend/service"
import { OrderShippedEmail } from "../modules/resend/emails/order-shipped"

interface FulfillmentCreatedData {
  id: string
  order_id: string
  fulfillment_id: string
  no_notification?: boolean
}

export default async function orderShippedHandler({
  event: { data },
  container,
}: SubscriberArgs<FulfillmentCreatedData>) {
  console.log("[OrderShipped] Event received:", data)

  // Ne pas envoyer de notification si explicitement désactivé
  if (data.no_notification) {
    console.log("[OrderShipped] Notification disabled, skipping email")
    return
  }

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    // Récupérer les détails de la commande
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "items.*",
        "shipping_address.*",
        "fulfillments.*",
        "fulfillments.labels.*",
      ],
      filters: { id: data.order_id },
    })

    const order = orders[0] as any

    if (!order) {
      console.error("[OrderShipped] Order not found:", data.order_id)
      return
    }

    console.log("[OrderShipped] Processing shipment for order:", order.display_id)

    // Extraire le prénom du client
    const customerName = order.shipping_address?.first_name || "Client"

    // Préparer les items
    const items = (order.items || []).map((item: any) => ({
      title: item.title || item.product_title || "Produit",
      quantity: item.quantity || 1,
    }))

    // Chercher les informations de tracking dans le fulfillment
    const fulfillment = (order.fulfillments || []).find(
      (f: any) => f.id === data.fulfillment_id
    )

    let trackingNumber: string | undefined
    let trackingUrl: string | undefined
    let carrier = "Viticolis"

    if (fulfillment) {
      // Récupérer le tracking depuis les labels ou les données du fulfillment
      const label = fulfillment.labels?.[0]
      trackingNumber = label?.tracking_number || fulfillment.tracking_number
      trackingUrl = label?.tracking_url || fulfillment.tracking_url

      if (fulfillment.provider_id) {
        carrier = fulfillment.provider_id
      }
    }

    // Envoyer l'email
    await resendService.sendEmail({
      to: order.email,
      subject: `Commande #${order.display_id} expédiée - Da Faustino`,
      react: OrderShippedEmail({
        orderNumber: order.display_id,
        customerName,
        items,
        trackingNumber,
        trackingUrl,
        carrier,
        shippingAddress: order.shipping_address
          ? {
              address_1: order.shipping_address.address_1,
              address_2: order.shipping_address.address_2,
              postal_code: order.shipping_address.postal_code,
              city: order.shipping_address.city,
            }
          : undefined,
      }),
    })

    console.log(`[OrderShipped] Email sent for order #${order.display_id} to ${order.email}`)
  } catch (error) {
    console.error("[OrderShipped] Error processing shipment:", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
}
