export default () => ({
  env: process.env.NODE_ENV,

  app: {
    name: process.env.APP_NAME,
    port: parseInt(process.env.PORT, 10),
  },

  frontend: {
    url: process.env.FRONTEND_URL,
  },

  auth: {
    salt: parseInt(process.env.SALT, 10),
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      confirmationExpiresIn: process.env.JWT_CONFIRMATION_EXPIRES_IN,
      resetPasswordExpiresIn: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,
    },
  },

  throttler: {
    ttl: parseInt(process.env.THROTTLER_TTL, 10),
    limit: parseInt(process.env.THROTTLER_LIMIT, 10),
  },

  database: {
    uri: process.env.DATABASE_URL,
  },

  cache: {
    ttl: parseInt(process.env.CACHE_TTL, 10),
    max: parseInt(process.env.CACHE_MAX, 10),
  },
});
