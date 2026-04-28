import { useRuntimeConfig } from '#imports';
import { $fetch } from 'ofetch';

export const useCrudBenchmark = () => {
  const config = useRuntimeConfig();
  const restUrl = config.public.restUrl;
  const graphqlUrl = config.public.graphqlUrl;

  // Utilitaire de mesure précis
  const measure = async (name: string, fn: () => Promise<any>) => {
    const start = performance.now();
    let res;
    try {
      res = await fn();
      const end = performance.now();

      // Extraction du texte pour le poids
      const text = typeof res._data === 'string' ? res._data : JSON.stringify(res._data);
      const sizeKb = new Blob([text]).size / 1024;

      return {
        name,
        durationMs: end - start,
        sizeKb,
        data: res._data,
        error: null
      };
    } catch (err: any) {
      return {
        name,
        durationMs: 0,
        sizeKb: 0,
        data: null,
        error: err.data?.error?.message || err.data?.errors?.[0]?.message || err.message || 'Erreur API'
      };
    }
  };

  // ==========================================
  // 1. LECTURE (R)
  // ==========================================
  const executeReadWithRest = async () => {
    const qs = '?populate=*&pagination[pageSize]=100';
    return measure('REST - Read 100 Orders', () =>
        $fetch.raw(`${restUrl}/commandes${qs}`, { method: 'GET' })
    );
  };

  const executeReadWithGraphql = async () => {
    const query = `
      query GetCommandes {
        commandes(pagination: { pageSize: 100 }) {
          documentId
          date_commande
          statut
          client {
            documentId
            nom
          }
          ligne_commandes {
            documentId
            quantite
            produit {
              documentId
              nom
              prix
            }
          }
        }
      }
    `;
    return measure('GraphQL - Read 100 Orders', () =>
        $fetch.raw(graphqlUrl as string, {
          method: 'POST',
          body: { query }
        })
    );
  };

  // ==========================================
  // 2. CRÉATION (C)
  // ==========================================
  const executeCreateWithRest = async () => {
    return measure('REST - Create Order', () =>
        $fetch.raw(`${restUrl}/commandes`, {
          method: 'POST',
          body: {
            data: {
              date_commande: "2026-04-27T13:00:00.000Z",
              statut: 'En cours',
            }
          }
        })
    );
  };

  const executeCreateWithGraphql = async (clientDocId: string) => {
    const mutation = `
      mutation CreateCommande($data: CommandeInput!) {
        createCommande(data: $data) {
          documentId
          statut
        }
      }
    `;
    return measure('GraphQL - Create Order', () =>
        $fetch.raw(graphqlUrl as string, {
          method: 'POST',
          body: {
            query: mutation,
            variables: {
              data: {
                date_commande: new Date().toISOString(),
                statut: "En_cours",
                client: clientDocId || null
              }
            }
          }
        })
    );
  };

  // ==========================================
  // 3. MISE À JOUR (U)
  // ==========================================
  const executeUpdateWithRest = async (orderDocId: string) => {
    return measure('REST - Update Order', () =>
        $fetch.raw(`${restUrl}/commandes/${orderDocId}`, {
          method: 'PUT',
          body: {
            data: {
              statut: 'Livrée'
            }
          }
        })
    );
  };

  const executeUpdateWithGraphql = async (orderDocId: string) => {
    const mutation = `
      mutation UpdateCommande($documentId: ID!, $data: CommandeInput!) {
        updateCommande(documentId: $documentId, data: $data) {
          documentId
          statut
        }
      }
    `;
    return measure('GraphQL - Update Order', () =>
        $fetch.raw(graphqlUrl as string, {
          method: 'POST',
          body: {
            query: mutation,
            variables: {
              documentId: orderDocId,
              data: {
                statut: "Livrée"
              }
            }
          }
        })
    );
  };

  // ==========================================
  // 4. SUPPRESSION (D)
  // ==========================================
  const executeDeleteWithRest = async (orderDocId: string) => {
    return measure('REST - Delete Order', () =>
        $fetch.raw(`${restUrl}/commandes/${orderDocId}`, {
          method: 'DELETE'
        })
    );
  };

  const executeDeleteWithGraphql = async (orderDocId: string) => {
    const mutation = `
      mutation DeleteCommande($documentId: ID!) {
        deleteCommande(documentId: $documentId) {
          documentId
        }
      }
    `;
    return measure('GraphQL - Delete Order', () =>
        $fetch.raw(graphqlUrl as string, {
          method: 'POST',
          body: {
            query: mutation,
            variables: { documentId: orderDocId }
          }
        })
    );
  };

  return {
    executeReadWithRest, executeReadWithGraphql,
    executeCreateWithRest, executeCreateWithGraphql,
    executeUpdateWithRest, executeUpdateWithGraphql,
    executeDeleteWithRest, executeDeleteWithGraphql
  };
};