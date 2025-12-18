import { auditService, AuditEventType } from "../audit"

// Configuration du rate limiting
const RATE_LIMIT_CONFIG = {
  // Nombre maximum de tentatives échouées par IP
  MAX_FAILED_ATTEMPTS: 5,
  // Période de temps pour compter les tentatives (en minutes)
  TIME_WINDOW_MINUTES: 15,
  // Durée de blocage après trop de tentatives (en minutes)
  LOCKOUT_DURATION_MINUTES: 30,
}

export interface RateLimitResult {
  allowed: boolean
  remainingAttempts: number
  lockedUntil?: Date
  message?: string
}

export class RateLimitService {
  /**
   * Vérifie si une IP est autorisée à tenter une connexion
   */
  async checkLoginAttempt(ipAddress: string): Promise<RateLimitResult> {
    const since = new Date()
    since.setMinutes(since.getMinutes() - RATE_LIMIT_CONFIG.TIME_WINDOW_MINUTES)

    try {
      const failedAttempts = await auditService.getFailedLoginAttempts(
        ipAddress,
        since
      )

      const remainingAttempts = Math.max(
        0,
        RATE_LIMIT_CONFIG.MAX_FAILED_ATTEMPTS - failedAttempts
      )

      if (failedAttempts >= RATE_LIMIT_CONFIG.MAX_FAILED_ATTEMPTS) {
        const lockedUntil = new Date()
        lockedUntil.setMinutes(
          lockedUntil.getMinutes() + RATE_LIMIT_CONFIG.LOCKOUT_DURATION_MINUTES
        )

        return {
          allowed: false,
          remainingAttempts: 0,
          lockedUntil,
          message: `Trop de tentatives échouées. Réessayez dans ${RATE_LIMIT_CONFIG.LOCKOUT_DURATION_MINUTES} minutes.`,
        }
      }

      return {
        allowed: true,
        remainingAttempts,
      }
    } catch (error) {
      console.error("[RateLimitService] Error checking rate limit:", error)
      // En cas d'erreur, autoriser la tentative pour ne pas bloquer l'accès
      return {
        allowed: true,
        remainingAttempts: RATE_LIMIT_CONFIG.MAX_FAILED_ATTEMPTS,
      }
    }
  }

  /**
   * Vérifie si une IP est actuellement bloquée
   */
  async isBlocked(ipAddress: string): Promise<boolean> {
    const result = await this.checkLoginAttempt(ipAddress)
    return !result.allowed
  }

  /**
   * Récupère le statut de rate limit pour une IP
   */
  async getStatus(ipAddress: string): Promise<{
    failedAttempts: number
    maxAttempts: number
    timeWindowMinutes: number
    isBlocked: boolean
  }> {
    const since = new Date()
    since.setMinutes(since.getMinutes() - RATE_LIMIT_CONFIG.TIME_WINDOW_MINUTES)

    const failedAttempts = await auditService.getFailedLoginAttempts(
      ipAddress,
      since
    )

    return {
      failedAttempts,
      maxAttempts: RATE_LIMIT_CONFIG.MAX_FAILED_ATTEMPTS,
      timeWindowMinutes: RATE_LIMIT_CONFIG.TIME_WINDOW_MINUTES,
      isBlocked: failedAttempts >= RATE_LIMIT_CONFIG.MAX_FAILED_ATTEMPTS,
    }
  }
}

// Singleton
export const rateLimitService = new RateLimitService()
