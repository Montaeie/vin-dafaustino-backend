import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Force rebuild v4 - Debug CORS

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:9000"
const STOREFRONT_URL = process.env.STOREFRONT_URL || "http://localhost:3000"
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379"

// Debug: Log CORS values at startup
console.log("=== CORS DEBUG ===")
console.log("STORE_CORS env:", process.env.STORE_CORS)
console.log("STOREFRONT_URL env:", process.env.STOREFRONT_URL)
console.log("STOREFRONT_URL fallback:", STOREFRONT_URL)
console.log("==================")

// Use regex pattern to match dafaustino domains + vercel + localhost
const STORE_CORS_VALUE = process.env.STORE_CORS ||
  "https://www.dafaustino.com,https://dafaustino.com,/\\.vercel\\.app$/,http://localhost:3000"

const ADMIN_CORS_VALUE = process.env.ADMIN_CORS || BACKEND_URL

const AUTH_CORS_VALUE = process.env.AUTH_CORS ||
  `${BACKEND_URL},https://www.dafaustino.com,https://dafaustino.com`

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: STORE_CORS_VALUE,
      adminCors: ADMIN_CORS_VALUE,
      authCors: AUTH_CORS_VALUE,
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
    // Cloudflare R2 File Storage (S3 compatible)
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION || "auto",
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
            },
          },
        ],
      },
    },
  ],

  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    // backendUrl uses browser origin by default - no localhost fallback
  },
})
