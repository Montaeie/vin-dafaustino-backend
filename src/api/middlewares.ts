import { defineMiddlewares } from "@medusajs/medusa"
import cors from "cors"

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://www.dafaustino.com",
  "https://dafaustino.com",
  "http://localhost:3000",
  "http://localhost:8000",
]

// Use the cors package directly with custom configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) {
      callback(null, true)
      return
    }

    // Check if origin is allowed
    if (ALLOWED_ORIGINS.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "x-publishable-api-key", "Cookie"],
  exposedHeaders: ["set-cookie"],
}

const corsMiddleware = cors(corsOptions)

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/*",
      middlewares: [corsMiddleware as any],
    },
    {
      matcher: "/auth/*",
      middlewares: [corsMiddleware as any],
    },
  ],
})
