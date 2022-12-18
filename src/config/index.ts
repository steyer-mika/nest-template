export default () => ({
  env: process.env.NODE_ENV || 'dev',

  app: {
    name: process.env.APP_NAME || '',
    port: parseInt(process.env.PORT, 10) || 4200,
  },

  frontend: process.env.FRONTEND_URL || '',

  auth: {
    salt: parseInt(process.env.SALT, 10) || 10,
    jwt: {
      secret: process.env.JWT_SECRET || '',
      expiresIn: process.env.JWT_EXPIRES_IN || '2d',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    },
  },

  throttler: {
    ttl: parseInt(process.env.THROTTLER_TTL, 10) || 10,
    limit: parseInt(process.env.THROTTLER_LIMIT, 10) || 10,
  },

  database: {
    uri: process.env.MONGODB_URI || '',
  },
});
