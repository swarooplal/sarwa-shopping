import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    redisUrl: process.env.REDIS_URL!
  },
  admin: {
    vite: (config) => {
      config.server = {
        ...config.server,
        allowedHosts: process.env.VITE_CORS!?.split(",") ?? [],
      };
      return config;
    },
  },
  modules: [
    {
      key: Modules.FILE,
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              upload_dir: "static",
              // Append /static so that generated links directly point to the file path on your server
              backend_url: `${process.env.MEDUSA_BACKEND_URL}/static`,
            },
          },
        ],
      },
    },
  ]
})
