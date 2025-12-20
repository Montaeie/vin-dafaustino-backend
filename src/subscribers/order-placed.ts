import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { resendService } from "../modules/resend/service"
import { OrderConfirmationEmail } from "../modules/resend/emails/order-confirmation"
import { auditService, AuditEventType } from "../modules/audit"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  console.log("[OrderPlaced] Event received:", data.id)

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    // Récupérer les détails de la commande
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "total",
        "subtotal",
        "shipping_total",
        "items.*",
        "shipping_address.*",
      ],
      filters: { id: data.id },
    })

    const order = orders[0] as any

    if (!order) {
      console.error("[OrderPlaced] Order not found:", data.id)
      return
    }

    console.log("[OrderPlaced] Processing order:", order.display_id)

    // Extraire le prénom du client
    const customerName = order.shipping_address?.first_name || "Client"

    // Extraire les valeurs numériques (gérer les BigNumber de Medusa)
    const getNumericValue = (value: any): number => {
      if (typeof value === "object" && value !== null) {
        return parseFloat(value.numeric || value.numeric_ || value.value || value.amount || 0)
      }
      return typeof value === "number" ? value : parseFloat(value) || 0
    }

    // Préparer les items pour l'email
    const items = (order.items || []).map((item: any) => ({
      title: item.title || item.product_title || "Produit",
      quantity: item.quantity || 1,
      unit_price: getNumericValue(item.unit_price),
      thumbnail: item.thumbnail,
    }))

    const subtotal = getNumericValue(order.subtotal)
    const shippingTotal = getNumericValue(order.shipping_total)
    const total = getNumericValue(order.total)

    // Envoyer l'email
    await resendService.sendEmail({
      to: order.email,
      subject: `Commande #${order.display_id} confirmée - Da Faustino`,
      react: OrderConfirmationEmail({
        orderNumber: order.display_id,
        customerName,
        email: order.email,
        items,
        subtotal,
        shippingTotal,
        total,
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

    console.log(`[OrderPlaced] Email sent for order #${order.display_id} to ${order.email}`)

    // Logger l'événement pour l'audit
    await auditService.log({
      event_type: AuditEventType.ORDER_PLACED,
      customer_email: order.email,
      metadata: {
        order_id: order.id,
        display_id: order.display_id,
        total,
        items_count: items.length,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[OrderPlaced] Error processing order:", error)
    // Ne pas throw pour éviter de bloquer le workflow
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
