const swaggerJsDoc = require('./docs/swagger');

const swaggerConfig = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Social Dashboard API Docs',
};

module.exports = {
  swaggerJsDoc,
  swaggerConfig,
};
