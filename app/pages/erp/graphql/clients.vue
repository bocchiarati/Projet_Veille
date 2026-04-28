<template>
  <div class="px-4 py-8 max-w-7xl mx-auto relative">
    <div class="mb-8 border-b pb-4 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-pink-900 mb-2">Annuaire Clients - Vue GraphQL</h1>
        <p class="text-gray-600">Récupération optimisée via une seule requête GraphQL.</p>
      </div>
      <div class="text-right">
        <NuxtLink to="/erp/rest/clients" class="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-300 transition-colors">
          Basculer vers REST &rarr;
        </NuxtLink>
      </div>
    </div>

    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-900 mx-auto"></div>
      <p class="mt-4 text-gray-500">Chargement de la ressource GraphQL...</p>
    </div>

    <div v-else class="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 class="font-bold text-gray-800">Liste des clients enregistrés</h2>
        <span class="text-sm font-medium text-pink-700 bg-pink-50 px-3 py-1 rounded-full">
          Total : {{ total }}
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-white">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom du Client</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-sm">
          <tr v-for="client in clients" :key="client.documentId" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-gray-400 font-mono text-xs">{{ client.documentId }}</td>
            <td class="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{{ client.nom }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-600">{{ client.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <NuxtLink
                  :to="`/erp/graphql/client?id=${client.documentId}`"
                  class="text-pink-600 hover:text-pink-900 font-medium bg-pink-50 px-4 py-1.5 rounded-full text-xs transition-colors"
              >
                Voir fiche
              </NuxtLink>
            </td>
          </tr>
          <tr v-if="!clients.length">
            <td colspan="4" class="px-6 py-4 text-center text-gray-500 italic">Aucun client trouvé dans la base.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <MetricOverlay method="GraphQL" :metrics="metrics" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePageMetrics } from '~/composables/usePageMetrics';
import MetricOverlay from '~/components/MetricOverlay.vue';

// On récupère les outils de mesure
const { metrics, measureCalls } = usePageMetrics();
const config = useRuntimeConfig();

// Variables réactives
const clients = ref<any[]>([]);
const total = ref(0);
const loading = ref(true);

const fetchClientsData = async () => {
  // On utilise la syntaxe exacte qui fonctionne dans ton Dashboard.vue
  const query = `
    query GetClientsList {
      clients_connection {
        pageInfo {
          total
        }
      }
      clients(sort: "nom:asc", pagination: { limit: 100 }) {
        documentId
        nom
        email
      }
    }
  `;

  try {
    loading.value = true;

    // Pattern identique à ton dashboard.vue : wrapper measureCalls + $fetch.raw
    const calls = [
      () => $fetch.raw(config.public.graphqlUrl as string, {
        method: 'POST',
        body: { query } // Le payload attendu par Strapi
      })
    ];

    const result = await measureCalls(calls);

    // Extraction sécurisée comme dans ton dashboard
    if (result && result.data) {
      const content = result.data;

      // Mapping des résultats selon les clés de la query
      clients.value = content.clients || [];
      total.value = content.clients_connection?.pageInfo?.total || 0;

      console.log("✅ Clients chargés via GraphQL:", clients.value.length);
    }
  } catch (error) {
    console.error("🚨 Erreur critique sur la page Liste Clients GQL :", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchClientsData();
});
</script>