import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Force rebuild - BACKEND_URL must be set in production environment

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:9000"
const STOREFRONT_URL = process.env.STOREFRONT_URL || "http://localhost:3000"
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379"

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS || STOREFRONT_URL,
      adminCors: process.env.ADMIN_CORS || BACKEND_URL,
      authCors: process.env.AUTH_CORS || `${BACKEND_URL},${STOREFRONT_URL}`,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    // Mode shared : API + Worker dans le même process
    workerMode: "shared",
  },

  // Modules configurés
  modules: [
    // ⚠️ CRITIQUE : Redis Event Bus avec key: Modules.EVENT_BUS
    // Sans cette ligne exacte, les emails ne fonctionnent pas
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      key: Modules.EVENT_BUS,
      options: {
        redisUrl: REDIS_URL,
      },
    },
    // Stripe Payment Provider
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
            },
          },
        ],
      },
    },
  ],

  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: BACKEND_URL,
  },
})
