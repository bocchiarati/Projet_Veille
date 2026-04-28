<template>
  <div class="px-4 py-8 max-w-7xl mx-auto relative">
    <div class="mb-8 border-b pb-4 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-blue-900 mb-2">Liste Clients - Vue REST</h1>
        <p class="text-gray-600">Récupération d'une collection (Liste) via GET /api/clients.</p>
      </div>
      <div class="text-right">
        <NuxtLink to="/erp/graphql/clients" class="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-300 transition-colors">
          Basculer vers GraphQL &rarr;
        </NuxtLink>
      </div>
    </div>

    <!--
      ANALYSE DX (Developer Experience) :
      En REST, récupérer une liste paginée nécessite de parser la clé `meta.pagination`.
      C'est standard, mais la structure de réponse diffère de GraphQL.
      Ici on fait appel à /api/clients?populate=* si on voulait des relations,
      ce qui alourdirait massivement la réponse.
    -->

    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
      <p class="mt-4 text-gray-500">Chargement REST...</p>
    </div>

    <div v-else class="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 class="font-bold text-gray-800">Annuaire Clients</h2>
        <span class="text-sm text-gray-500">Total : {{ total }} clients</span>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-white">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-sm">
            <tr v-for="client in clients" :key="client.documentId" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-xs">{{ client.documentId }}</td>
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ client.nom }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ client.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <NuxtLink :to="`/erp/rest/client?id=${client.documentId}`" class="text-blue-600 hover:text-blue-900 font-medium text-xs bg-blue-50 px-3 py-1 rounded-full">
                  Voir Fiche
                </NuxtLink>
              </td>
            </tr>
            <tr v-if="!clients?.length">
              <td colspan="4" class="px-6 py-4 text-center text-gray-500">Aucun client trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Outil de Mesure Injecté -->
    <MetricOverlay method="REST" :metrics="metrics" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePageMetrics } from '~/composables/usePageMetrics';
import MetricOverlay from '~/components/MetricOverlay.vue';

const { metrics, measureCalls } = usePageMetrics();
const config = useRuntimeConfig();

const clients = ref<any[]>([]);
const total = ref(0);
const loading = ref(true);

onMounted(async () => {
  // ANALYSE RÉSEAU :
  // En REST, même sans relations (populate), Strapi renvoie les champs de date (createdAt, updatedAt, publishedAt)
  // pour chaque client, augmentant inutilement le poids du JSON si on ne les affiche pas.
  const url = `${config.public.restUrl}/clients?pagination[pageSize]=50&pagination[withCount]=true`;

  const calls = [() => $fetch.raw(url)];
  const result = await measureCalls(calls);

  if (result) {
    clients.value = result.data || [];
    total.value = result.meta?.pagination?.total || 0;
  }

  loading.value = false;
});
</script>