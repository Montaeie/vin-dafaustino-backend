import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { resendService } from "../modules/resend/service"
import { AccountDeletedEmail } from "../modules/resend/emails/account-deleted"

export default async function accountDeletedHandler({
  event: { data },
}: SubscriberArgs<{ id: string; email: string; first_name?: string; last_name?: string }>) {
  console.log("[AccountDeleted] Event received for:", data.email)

  try {
    const customerName = data.first_name || "Client"
    const email = data.email

    if (!email) {
      console.error("[AccountDeleted] No email provided")
      return
    }

    await resendService.sendEmail({
      to: email,
      subject: "Votre compte a ete supprime - Da Faustino",
      react: AccountDeletedEmail({
        customerName,
        email,
      }),
    })

    console.log(`[AccountDeleted] Email sent to ${email}`)
  } catch (error) {
    console.error("[AccountDeleted] Error sending email:", error)
  }
}

export const config: SubscriberConfig = {
  event: "customer.deleted",
}
