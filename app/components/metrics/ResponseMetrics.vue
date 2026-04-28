<template>
  <div class="bg-white shadow-md rounded-lg p-6 my-4">
    <h3 class="text-xl font-semibold mb-4 border-b pb-2">{{ title }}</h3>
    <div v-if="loading" class="text-gray-500">Chargement...</div>
    <div v-if="error" class="text-red-500">Erreur: {{ error.message }}</div>
    <div v-if="metrics" class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <div>
        <p class="text-sm text-gray-500">Temps de réponse</p>
        <p class="text-2xl font-bold">{{ metrics.duration.toFixed(2) }} ms</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Taille de la réponse</p>
        <p class="text-2xl font-bold">{{ (metrics.payloadSize / 1024).toFixed(2) }} KB</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Nb. de requêtes</p>
        <p class="text-2xl font-bold">{{ metrics.requestCount }}</p>
      </div>
    </div>
    <div v-if="data" class="mt-6">
      <h4 class="text-lg font-medium">Données reçues :</h4>
      <pre class="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto mt-2 max-h-96"><code>{{ JSON.stringify(data, null, 2) }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  metrics: {
    type: Object as () => { duration: number; payloadSize: number; requestCount: number } | null,
    default: null
  },
  data: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: Error,
    default: null
  }
});
</script>