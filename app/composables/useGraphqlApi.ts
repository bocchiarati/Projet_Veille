export const useGraphqlApi = () => {
  const getOrderDetails = async () => {
    const config = useRuntimeConfig();
    const graphqlUrl = config.public.graphqlUrl;

    const query = `
  query GetAllOrders {
  commandes {
    documentId
    statut
    client {
      documentId
      email
    }
    ligne_commandes {
      quantite
      # Relation Produit à l'intérieur des lignes
      produit {
        documentId
        nom
        prix
      }
    }
  }
}
`;

    const startTime = performance.now();
    let payloadSize: number;

    const response = await $fetch.raw(graphqlUrl as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        query,
      }
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Calculate payload size in bytes
    const jsonString = JSON.stringify(response._data);
    payloadSize = new Blob([jsonString]).size;

    return {
      data: response._data,
      metrics: {
        duration,
        payloadSize,
        requestCount: 1
      }
    };
  };

  return {
    getOrderDetails
  };
};
