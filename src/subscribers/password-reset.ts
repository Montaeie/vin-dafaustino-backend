import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { resendService } from "../modules/resend/service"
import { PasswordResetEmail } from "../modules/resend/emails/password-reset"

interface PasswordResetData {
  entity_id: string
  token: string
  actor_type: string
}

export default async function passwordResetHandler({
  event: { data },
}: SubscriberArgs<PasswordResetData>) {
  console.log("[PasswordReset] Event received for:", data.entity_id)

  try {
    // L'entity_id est l'email du client dans le cas d'un reset password
    const email = data.entity_id
    const token = data.token

    if (!email || !token) {
      console.error("[PasswordReset] Missing email or token")
      return
    }

    // Construire le lien de reset
    const storefrontUrl = process.env.STOREFRONT_URL || "https://dafaustino.com"
    const resetLink = `${storefrontUrl}/reinitialiser-mot-de-passe?token=${token}&email=${encodeURIComponent(email)}`

    // Extraire le nom du client depuis l'email (avant le @)
    const customerName = email.split("@")[0]

    // Envoyer l'email
    await resendService.sendEmail({
      to: email,
      subject: "Réinitialisation de votre mot de passe - Da Faustino",
      react: PasswordResetEmail({
        customerName,
        resetLink,
      }),
    })

    console.log(`[PasswordReset] Reset email sent to ${email}`)
  } catch (error) {
    console.error("[PasswordReset] Error sending reset email:", error)
  }
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
