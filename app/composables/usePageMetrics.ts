import { ref } from 'vue';

export const usePageMetrics = () => {
  const metrics = ref({
    durationMs: 0,
    sizeKb: 0,
    roundTrips: 0,
    fieldsReceived: 0,
  });

  const countKeys = (obj: any): number => {
    if (Array.isArray(obj)) return obj.reduce((acc, val) => acc + countKeys(val), 0);
    if (typeof obj === 'object' && obj !== null) {
      return Object.keys(obj).reduce((acc, key) => acc + countKeys(obj[key]), 1);
    }
    return 1;
  };

  const measureCalls = async (calls: (() => Promise<Response>)[]) => {
    const start = performance.now();
    metrics.value.roundTrips = calls.length;
    
    let totalSizeKb = 0;
    let totalFields = 0;
    let resultsData = [];

    try {
      const responses = await Promise.all(calls.map(c => c()));
      const end = performance.now();
      metrics.value.durationMs = end - start;

      for (const res of responses) {
        const text = typeof (res as any)._data === 'string' 
          ? (res as any)._data 
          : JSON.stringify((res as any)._data || res);
          
        totalSizeKb += new Blob([text]).size / 1024;
        
        const data = (res as any)._data || await res.json().catch(() => ({}));
        totalFields += countKeys(data);
        resultsData.push(data);
      }

      metrics.value.sizeKb = totalSizeKb;
      metrics.value.fieldsReceived = totalFields;
      
      return resultsData.length === 1 ? resultsData[0] : resultsData;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  return { metrics, measureCalls };
};