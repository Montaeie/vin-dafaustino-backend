import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { rateLimitService } from "../../../../modules/rate-limit"

// POST /store/auth/check-rate-limit - Vérifie si l'IP est autorisée à tenter une connexion
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  // Extraire l'IP de la requête
  const ipAddress =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.headers["x-real-ip"] as string ||
    req.socket?.remoteAddress ||
    "unknown"

  try {
    const result = await rateLimitService.checkLoginAttempt(ipAddress)

    if (!result.allowed) {
      return res.status(429).json({
        allowed: false,
        message: result.message,
        locked_until: result.lockedUntil?.toISOString(),
        remaining_attempts: 0,
      })
    }

    res.json({
      allowed: true,
      remaining_attempts: result.remainingAttempts,
    })
  } catch (error) {
    console.error("[RateLimit API] Error:", error)
    // En cas d'erreur, autoriser la tentative
    res.json({ allowed: true, remaining_attempts: 5 })
  }
}

// GET /store/auth/check-rate-limit - Récupère le statut du rate limit
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const ipAddress =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.headers["x-real-ip"] as string ||
    req.socket?.remoteAddress ||
    "unknown"

  try {
    const status = await rateLimitService.getStatus(ipAddress)

    res.json({
      failed_attempts: status.failedAttempts,
      max_attempts: status.maxAttempts,
      time_window_minutes: status.timeWindowMinutes,
      is_blocked: status.isBlocked,
    })
  } catch (error) {
    console.error("[RateLimit API] Error:", error)
    res.status(500).json({ error: "Erreur lors de la vérification du rate limit" })
  }
}
