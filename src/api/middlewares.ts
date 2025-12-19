import { defineMiddlewares } from "@medusajs/medusa"
import type { MedusaNextFunction, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://www.dafaustino.com",
  "https://dafaustino.com",
  "http://localhost:3000",
  "http://localhost:8000",
]

// Custom CORS middleware that forces headers
const corsMiddleware = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  const origin = req.headers.origin

  // Check if origin is allowed (including vercel.app domains)
  const isAllowed = origin && (
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith(".vercel.app")
  )

  if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin)
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-publishable-api-key")
  }

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(204).end()
    return
  }

  next()
}

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/*",
      middlewares: [corsMiddleware],
    },
    {
      matcher: "/auth/*",
      middlewares: [corsMiddleware],
    },
  ],
})
