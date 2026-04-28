<template>
  <div class="px-4 py-8 max-w-7xl mx-auto relative">
    <div class="mb-8 border-b pb-4 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-pink-900 mb-2">ERP Dashboard - Vue GraphQL</h1>
        <p class="text-gray-600">Chargement des indicateurs clés via l'API GraphQL de Strapi.</p>
      </div>
      <div class="text-right">
        <NuxtLink to="/erp/rest" class="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-300">
          &larr; Revenir vers REST
        </NuxtLink>
      </div>
    </div>

    <!-- Interface d'un Dashboard type ERP -->
    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-900 mx-auto"></div>
      <p class="mt-4 text-gray-500">Chargement de la ressource GraphQL (1 seule requête)...</p>
    </div>

    <div v-else class="space-y-8">
      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div class="bg-pink-100 p-4 rounded-full mr-4">
            <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Commandes Totales</p>
            <p class="text-3xl font-bold text-gray-900">{{ data.stats.commandesCount }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div class="bg-pink-100 p-4 rounded-full mr-4">
            <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Clients Actifs</p>
            <p class="text-3xl font-bold text-gray-900">{{ data.stats.clientsCount }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div class="bg-pink-100 p-4 rounded-full mr-4">
            <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Produits en Catalogue</p>
            <p class="text-3xl font-bold text-gray-900">{{ data.stats.produitsCount }}</p>
          </div>
        </div>
      </div>

      <!-- Tables de données -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Dernières Commandes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 class="font-bold text-gray-800">Dernières Commandes</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-white">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200 text-sm">
                <tr v-for="cmd in data.dernieresCommandes" :key="cmd.documentId">
                  <td class="px-6 py-4 whitespace-nowrap">{{ new Date(cmd.date_commande).toLocaleDateString() }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ cmd.client?.nom || 'Inconnu' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                      {{ cmd.statut }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!data.dernieresCommandes?.length">
                  <td colspan="3" class="px-6 py-4 text-center text-gray-500">Aucune commande</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Produits Récents -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 class="font-bold text-gray-800">Catalogue Récent</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-white">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200 text-sm">
                <tr v-for="prod in data.derniersProduits" :key="prod.documentId">
                  <td class="px-6 py-4 whitespace-nowrap font-medium">{{ prod.nom }}</td>
                  <td class="px-6 py-4 whitespace-nowrap font-mono">{{ prod.prix }} €</td>
                </tr>
                <tr v-if="!data.derniersProduits?.length">
                  <td colspan="2" class="px-6 py-4 text-center text-gray-500">Aucun produit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Outil de Mesure Injecté -->
    <MetricOverlay method="GraphQL" :metrics="metrics" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePageMetrics } from '~/composables/usePageMetrics';
import MetricOverlay from '~/components/MetricOverlay.vue';

const { metrics, measureCalls } = usePageMetrics();
const config = useRuntimeConfig();

const data = ref({
  stats: {
    commandesCount: 0,
    clientsCount: 0,
    produitsCount: 0
  },
  dernieresCommandes: [],
  derniersProduits: []
});

const loading = ref(true);

onMounted(async () => {
  const query = `
    query GetDashboardData {
      commandes_connection { pageInfo { total } }
      clients_connection { pageInfo { total } }
      produits_connection { pageInfo { total } }
      commandes(sort: "createdAt:desc", pagination: { limit: 100 }) {
        documentId
        date_commande
        statut
        client { nom }
      }
      produits(sort: "createdAt:desc", pagination: { limit: 100 }) {
        documentId
        nom
        prix
      }
    }
  `;

  try {
    loading.value = true;

    // ICI : On utilise measureCalls au lieu de $fetch.raw direct
    const calls = [
      () => $fetch.raw(config.public.graphqlUrl as string, {
        method: 'POST',
        body: { query }
      })
    ];

    // C'est cette ligne qui déclenche la mise à jour de "metrics"
    const result = await measureCalls(calls);

    // Extraction des données (on accède à .data car measureCalls renvoie res._data)
    if (result && result.data) {
      const content = result.data;

      data.value.stats.commandesCount = content.commandes_connection?.pageInfo?.total || 0;
      data.value.stats.clientsCount = content.clients_connection?.pageInfo?.total || 0;
      data.value.stats.produitsCount = content.produits_connection?.pageInfo?.total || 0;

      data.value.dernieresCommandes = content.commandes || [];
      data.value.derniersProduits = content.produits || [];
    }

  } catch (error) {
    console.error("Erreur critique Dashboard GQL :", error);
  } finally {
    loading.value = false;
  }
});
</script>