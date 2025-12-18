import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { resendService } from "../modules/resend/service"
import { WelcomeEmail } from "../modules/resend/emails/welcome"

export default async function customerWelcomeHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  console.log("[CustomerWelcome] Event received:", data.id)

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    // Récupérer les détails du client
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "email", "first_name", "last_name"],
      filters: { id: data.id },
    })

    const customer = customers[0]

    if (!customer) {
      console.error("[CustomerWelcome] Customer not found:", data.id)
      return
    }

    if (!customer.email) {
      console.error("[CustomerWelcome] Customer has no email:", data.id)
      return
    }

    const customerName = customer.first_name || "cher client"

    // Envoyer l'email de bienvenue
    await resendService.sendEmail({
      to: customer.email,
      subject: "Bienvenue chez Da Faustino 🍷",
      react: WelcomeEmail({
        customerName,
        email: customer.email,
      }),
    })

    console.log(`[CustomerWelcome] Welcome email sent to ${customer.email}`)
  } catch (error) {
    console.error("[CustomerWelcome] Error sending welcome email:", error)
  }
}

export const config: SubscriberConfig = {
  event: "customer.created",
}
