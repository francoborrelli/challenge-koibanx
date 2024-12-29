import config from '../../config/config';

const swaggerDefinition = {
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

export default swaggerDefinition;
