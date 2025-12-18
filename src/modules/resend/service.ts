import { Resend } from "resend"
import React from "react"

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailOptions {
  to: string
  subject: string
  react: React.ReactElement
}

export class ResendService {
  async sendEmail({ to, subject, react }: SendEmailOptions) {
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

    try {
      const { data, error } = await resend.emails.send({
        from: `Da Faustino <${fromEmail}>`,
        to,
        subject,
        react,
      })

      if (error) {
        console.error("[ResendService] Error sending email:", error)
        throw error
      }

      console.log(`[ResendService] Email sent successfully to ${to}:`, data?.id)
      return data
    } catch (error) {
      console.error("[ResendService] Failed to send email:", error)
      throw error
    }
  }
}

// Singleton
export const resendService = new ResendService()
