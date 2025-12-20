import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { resendService } from "../modules/resend/service"
import { OrderCanceledEmail } from "../modules/resend/emails/order-canceled"

export default async function orderCanceledHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  console.log("[OrderCanceled] Event received:", data.id)

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "items.*",
        "shipping_address.*",
      ],
      filters: { id: data.id },
    })

    const order = orders[0] as any

    if (!order) {
      console.error("[OrderCanceled] Order not found:", data.id)
      return
    }

    console.log("[OrderCanceled] Processing order:", order.display_id)

    const customerName = order.shipping_address?.first_name || "Client"

    const items = (order.items || []).map((item: any) => ({
      title: item.title || item.product_title || "Produit",
      quantity: item.quantity || 1,
    }))

    await resendService.sendEmail({
      to: order.email,
      subject: `Commande #${order.display_id} annulee - Da Faustino`,
      react: OrderCanceledEmail({
        orderNumber: order.display_id,
        customerName,
        items,
      }),
    })

    console.log(`[OrderCanceled] Email sent for order #${order.display_id} to ${order.email}`)
  } catch (error) {
    console.error("[OrderCanceled] Error processing order:", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.canceled",
}
