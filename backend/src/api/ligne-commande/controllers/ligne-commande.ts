/**
 * ligne-commande controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::ligne-commande.ligne-commande', ({ strapi }) => ({
  /**
   * Crée un Ordre de Fabrication (OF) à partir d'une ligne de commande.
   * Utilisé par l'endpoint REST et le resolver GraphQL.
   */
  async createOf(ctx: any) {
    const { id } = ctx.params;

    try {
      // 1. Récupérer la ligne de commande et ses relations
      const ligneCommande = await strapi.entityService.findOne('api::ligne-commande.ligne-commande', id as any, {
        populate: ['produit', 'ordre_de_fabrication'],
      }) as any; // Cast to any to bypass strict type checking for populated fields

      if (!ligneCommande) {
        // Pour REST, ctx.notFound est une fonction. Pour GraphQL, nous lançons une erreur.
        return ctx.notFound ? ctx.notFound('Ligne de commande non trouvée.') : new Error('Ligne de commande non trouvée.');
      }

      // 2. Vérifier si un OF existe déjà
      if (ligneCommande.ordre_de_fabrication) {
        return ctx.badRequest ? ctx.badRequest('Un ordre de fabrication existe déjà.') : new Error('Un ordre de fabrication existe déjà.');
      }

      // 3. Vérifier si un produit est bien lié
      if (!ligneCommande.produit) {
        return ctx.badRequest ? ctx.badRequest('La ligne de commande ne contient pas de produit.') : new Error('La ligne de commande ne contient pas de produit.');
      }

      // 4. Créer le nouvel Ordre de Fabrication
      const newOf = await strapi.entityService.create('api::ordre-de-fabrication.ordre-de-fabrication', {
        data: {
          reference: `OF-${ligneCommande.documentId}-${Date.now()}`,
          quantite_a_produire: ligneCommande.quantite,
          date_lancement: new Date(),
          statut: 'Planifié',
          produit_id: ligneCommande.produit.documentId,
          ligne_commande: ligneCommande.documentId,
          publishedAt: new Date(), // Important for Strapi v4/v5 draft system
        },
      });

      // Pour REST, on utilise ctx.created. Pour GraphQL, on retourne directement les données.
      return ctx.created ? ctx.created(newOf) : newOf;

    } catch (error) {
      strapi.log.error('Erreur lors de la création de l\'OF:', error);
      return ctx.internalServerError ? ctx.internalServerError('Erreur interne.') : new Error('Erreur interne.');
    }
  },
}));