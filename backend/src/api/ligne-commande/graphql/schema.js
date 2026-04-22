module.exports = {
  definition: `
    type Mutation {
      createOf(id: ID!): OrdreDeFabricationEntityResponse
    }
  `,
  resolvers: {
    Mutation: {
      createOf: {
        resolve: async (parent, args, context) => {
          const { id } = args;
          const { toEntityResponse } = strapi.service('plugin::graphql.format');

          // Appeler la logique du contrôleur directement
          // Le contrôleur doit être modifié pour retourner les données ou lancer une erreur
          const newOf = await strapi.controller('api::ligne-commande.ligne-commande').createOf({
            params: { id },
            // Simuler un contexte minimal
            state: context.state,
            badRequest: (msg) => { throw new Error(msg); },
            notFound: (msg) => { throw new Error(msg); },
            internalServerError: (msg) => { throw new Error(msg); },
          });

          // Formater la réponse pour GraphQL
          return toEntityResponse(newOf, {
            args: {},
            resourceUID: 'api::ordre-de-fabrication.ordre-de-fabrication',
          });
        },
      },
    },
  },
};
