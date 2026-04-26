module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/ligne-commandes/:id/create-of',
      handler: 'ligne-commande.createOf',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
