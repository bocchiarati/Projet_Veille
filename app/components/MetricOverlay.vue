<template>
  <div v-if="metrics" class="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-2xl z-50 w-80 text-sm font-mono border border-gray-700">
    <div class="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
      <h4 class="font-bold text-indigo-400">Métriques de la page</h4>
      <span class="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">{{ method }}</span>
    </div>

    <div class="space-y-2">
      <div class="flex justify-between">
        <span class="text-gray-400">Temps de réponse:</span>
        <span :class="metrics.durationMs > 200 ? 'text-yellow-400' : 'text-green-400 font-bold'">{{ metrics.durationMs.toFixed(0) }} ms</span>
      </div>

      <div class="flex justify-between">
        <span class="text-gray-400">Poids total (JSON):</span>
        <span :class="metrics.sizeKb > 50 ? 'text-red-400' : 'text-blue-300'">{{ metrics.sizeKb.toFixed(2) }} KB</span>
      </div>

      <div class="flex justify-between">
        <span class="text-gray-400">Requêtes HTTP (R.T):</span>
        <span :class="metrics.roundTrips > 1 ? 'text-orange-400 font-bold' : 'text-green-400'">{{ metrics.roundTrips }}</span>
      </div>

      <div class="flex justify-between">
        <span class="text-gray-400">Champs (clés JSON):</span>
        <span class="text-pink-300">{{ metrics.fieldsReceived }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  method: 'REST' | 'GraphQL';
  metrics: {
    durationMs: number;
    sizeKb: number;
    roundTrips: number;
    fieldsReceived: number;
  } | null;
}>();
</script>