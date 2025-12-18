import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { resendService } from "../modules/resend/service"
import { OrderRefundedEmail } from "../modules/resend/emails/order-refunded"

export default async function orderRefundedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; refund_id?: string }>) {
  console.log("[OrderRefunded] Event received:", data.id)

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "refund_amount",
        "shipping_address.*",
      ],
      filters: { id: data.id },
    })

    const order = orders[0]

    if (!order) {
      console.error("[OrderRefunded] Order not found:", data.id)
      return
    }

    console.log("[OrderRefunded] Processing order:", order.display_id)

    const customerName = order.shipping_address?.first_name || "Client"

    // Extraire le montant du remboursement
    const getNumericValue = (value: any): number => {
      if (typeof value === "object" && value !== null) {
        return parseFloat(value.numeric || value.numeric_ || value.value || value.amount || 0)
      }
      return typeof value === "number" ? value : parseFloat(value) || 0
    }

    const refundAmount = getNumericValue(order.refund_amount)

    await resendService.sendEmail({
      to: order.email,
      subject: `Remboursement confirme - Commande #${order.display_id} - Da Faustino`,
      react: OrderRefundedEmail({
        orderNumber: order.display_id,
        customerName,
        refundAmount,
      }),
    })

    console.log(`[OrderRefunded] Email sent for order #${order.display_id} to ${order.email}`)
  } catch (error) {
    console.error("[OrderRefunded] Error processing refund:", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.refund_created",
}
