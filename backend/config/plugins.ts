import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  graphql: {
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: true,
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
      // Activer l'extension du schéma
      extension: {
        enabled: true,
      },
    },
  },
});

export default config;
