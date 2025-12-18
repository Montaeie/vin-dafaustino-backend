import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { resendService } from "../modules/resend/service"
import { PasswordChangedEmail } from "../modules/resend/emails/password-changed"

export default async function passwordChangedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ entity_id: string; actor_type: string }>) {
  // Ne traiter que les customers
  if (data.actor_type !== "customer") {
    return
  }

  console.log("[PasswordChanged] Event received for:", data.entity_id)

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    // entity_id est l'email pour le provider emailpass
    const email = data.entity_id

    // Chercher le customer par email
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "email", "first_name", "last_name"],
      filters: { email },
    })

    const customer = customers[0]
    const customerName = customer?.first_name || "Client"

    await resendService.sendEmail({
      to: email,
      subject: "Mot de passe modifie - Da Faustino",
      react: PasswordChangedEmail({
        customerName,
        email,
      }),
    })

    console.log(`[PasswordChanged] Email sent to ${email}`)
  } catch (error) {
    console.error("[PasswordChanged] Error sending email:", error)
  }
}

export const config: SubscriberConfig = {
  event: "auth.password_updated",
}
