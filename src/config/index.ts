export default () => ({
  port: parseInt(process.env.PORT, 10) || 4200,

  frontend: process.env.FRONTEND_URL || '',

  auth: {
    salt: parseInt(process.env.SALT, 10) || 10,
    jwt: {
      secret: process.env.JWT_SECRET || '',
      expiresIn: process.env.JWT_EXPIRES_IN || '2d',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    },
  },

  database: {
    uri: process.env.MONGODB_URI || '',
  },
});
