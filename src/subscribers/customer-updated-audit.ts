import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { auditService, AuditEventType } from "../modules/audit"

export default async function customerUpdatedHandler({
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

export const config: SubscriberConfig = {
  event: "customer.updated",
}
