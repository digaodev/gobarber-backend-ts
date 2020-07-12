export default {
  jwt: {
    secret: process.env.APP_SECRET || 'test-secret-key',
    expiresIn: '1d',
  },
};
