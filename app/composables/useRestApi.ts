export const useRestApi = () => {
  const config = useRuntimeConfig();
  const restUrl = config.public.restUrl;

  const getOrderDetails = async () => {
    const startTime = performance.now();
    let payloadSize = 0;
    
    // We fetch raw to access the Response object for size calculation
    const response = await $fetch.raw(`${restUrl}/commandes?pagination[pageSize]=100`, {
      method: 'GET',
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Calculate size
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
