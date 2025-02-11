import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition: swaggerJsdoc.Options['swaggerDefinition'] = {
  openapi: '3.0.0',
  info: {
    title: 'challenge-koibanx',
    version: '0.0.1',
    description: 'Challenge Koibanx',
    license: {
      name: 'MIT',
      url: 'https://github.com/francoborrelli/challenge-koibanx.git',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development Server',
    },
  ],
};

const router = express.Router();

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['packages/components.yaml', 'src/interface/routes/*.ts'],
});

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs, { explorer: true }));

export default router;
