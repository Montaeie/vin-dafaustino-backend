import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { auditService, AuditEventType } from "../modules/audit"

// Handler pour customer.created
export async function customerCreatedHandler({
  event: { data },
}: SubscriberArgs<{ id: string }>) {
  console.log("[CustomerAudit] Customer created:", data.id)

  try {
    await auditService.log({
      event_type: AuditEventType.ACCOUNT_CREATED,
      customer_id: data.id,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[CustomerAudit] Error logging customer.created:", error)
  }
}

// Handler pour customer.updated
export async function customerUpdatedHandler({
  event: { data },
}: SubscriberArgs<{ id: string }>) {
  console.log("[CustomerAudit] Customer updated:", data.id)

  try {
    await auditService.log({
      event_type: AuditEventType.ACCOUNT_UPDATED,
      customer_id: data.id,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[CustomerAudit] Error logging customer.updated:", error)
  }
}

// Export du handler par défaut pour l'événement principal
export default customerCreatedHandler

export const config: SubscriberConfig = {
  event: "customer.created",
}
