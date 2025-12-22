import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { resendService } from "../../../modules/resend/service"
import { NewsletterSubscriptionEmail } from "../../../modules/resend/emails/newsletter-subscription"

interface NewsletterSubscribeBody {
  email: string
}

// Simple in-memory store for newsletter subscribers
// In production, you'd want to use a database table or external service like Mailchimp
const newsletterSubscribers = new Set<string>()

export async function POST(
  req: MedusaRequest<NewsletterSubscribeBody>,
  res: MedusaResponse
) {
  try {
    const { email } = req.body

    // Validate email
    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email requis",
      })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Email invalide",
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if already subscribed (in-memory check)
    if (newsletterSubscribers.has(normalizedEmail)) {
      return res.status(200).json({
        success: true,
        message: "Vous etes deja inscrit a notre newsletter",
        alreadySubscribed: true,
      })
    }

    // Add to subscribers
    newsletterSubscribers.add(normalizedEmail)

    // Send confirmation email
    try {
      await resendService.sendEmail({
        to: normalizedEmail,
        subject: "Bienvenue dans la newsletter Da Faustino !",
        react: NewsletterSubscriptionEmail({ email: normalizedEmail }),
      })

      console.log(`[Newsletter] Subscription confirmed for: ${normalizedEmail}`)
    } catch (emailError) {
      console.error(`[Newsletter] Failed to send confirmation email:`, emailError)
      // Don't fail the subscription if email fails
    }

    return res.status(200).json({
      success: true,
      message: "Inscription reussie ! Verifiez votre boite mail.",
    })
  } catch (error) {
    console.error("[Newsletter] Subscription error:", error)
    return res.status(500).json({
      success: false,
      message: "Une erreur est survenue. Veuillez reessayer.",
    })
  }
}

// GET endpoint to check subscription status (optional)
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const email = req.query.email as string

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email requis",
    })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const isSubscribed = newsletterSubscribers.has(normalizedEmail)

  return res.status(200).json({
    success: true,
    subscribed: isSubscribed,
  })
}
