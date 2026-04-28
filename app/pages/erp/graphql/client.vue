<template>
  <div class="px-4 py-8 max-w-7xl mx-auto relative">
    <div class="mb-8 border-b pb-4 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-pink-900 mb-2">Fiche Client - Vue GraphQL</h1>
        <p class="text-gray-600">Détails du client et historique ciblé (Relation 1:N).</p>
      </div>
      <div class="text-right">
        <NuxtLink :to="`/erp/rest/client?id=${clientId}`" class="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-300 transition-colors">
          &larr; Revenir vers REST
        </NuxtLink>
      </div>
    </div>

    <!--
      ANALYSE DX :
      En GraphQL, on précise exactement les champs désirés de l'historique :
      documentId, date_commande, statut.
      Rien d'autre ne sera renvoyé, garantissant une UI légère et optimisée.
    -->

    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-900 mx-auto"></div>
      <p class="mt-4 text-gray-500">Chargement de la Fiche via GraphQL...</p>
    </div>

    <div v-else-if="!client" class="text-center py-20 text-red-500">
      Client introuvable.
    </div>

    <div v-else class="space-y-6">
      <!-- Informations Générales -->
      <div class="bg-white shadow sm:rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Informations Générales</h3>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Nom</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.nom }}</dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.email }}</dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Téléphone</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ client.telephone || 'Non renseigné' }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Historique Commandes -->
      <div class="bg-white shadow sm:rounded-lg overflow-hidden border border-gray-200">
        <div class="px-4 py-5 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Historique des Commandes ({{ client.commandes?.length || 0 }})</h3>
        </div>
        <ul class="divide-y divide-gray-200">
          <li v-for="cmd in client.commandes" :key="cmd.documentId" class="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <div>
              <p class="text-sm font-medium text-pink-600 truncate">Commande N° {{ cmd.documentId }}</p>
              <p class="text-sm text-gray-500">Date : {{ new Date(cmd.date_commande).toLocaleDateString() }}</p>
            </div>
            <div>
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                {{ cmd.statut }}
              </span>
            </div>
          </li>
          <li v-if="!client.commandes?.length" class="px-6 py-4 text-center text-gray-500">Aucune commande passée</li>
        </ul>
      </div>
    </div>

    <!-- Outil de Mesure Injecté -->
    <MetricOverlay method="GraphQL" :metrics="metrics" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePageMetrics } from '~/composables/usePageMetrics';
import MetricOverlay from '~/components/MetricOverlay.vue';

const { metrics, measureCalls } = usePageMetrics();
const config = useRuntimeConfig();
const route = useRoute();

const client = ref<any>(null);
const loading = ref(true);
const clientId = route.query.id as string || '';

onMounted(async () => {
  // ANALYSE RÉSEAU :
  // Précision totale. Le payload se résume uniquement aux 6 champs demandés.
  // De plus, la pagination de la relation 1:N (commandes) pourrait être gérée directement
  // dans la query GraphQL, ce qui est très difficile en REST via l'URL.
  const query = clientId
    ? `
      query GetClient($id: ID!) {
        client(documentId: $id) {
          documentId
          nom
          email
          commandes(sort: "date_commande:desc", pagination: { limit: 10 }) {
            documentId
            date_commande
            statut
          }
        }
      }
    `
    : `
      query GetFirstClient {
        clients(pagination: { limit: 1 }) {
          documentId
          nom
          email
          telephone
          commandes(sort: "date_commande:desc", pagination: { limit: 10 }) {
            documentId
            date_commande
            statut
          }
        }
      }
    `;

  const payload: any = { query };
  if (clientId) payload.variables = { id: clientId };

  const calls = [() => $fetch.raw(config.public.graphqlUrl as string, {
    method: 'POST',
    body: payload
  })];

  const result = await measureCalls(calls);

  if (result?.data) {
    if (clientId) client.value = result.data.client;
    else if (result.data.clients?.length > 0) client.value = result.data.clients[0];

    if (!clientId && client.value) route.query.id = client.value.documentId;
  }

  loading.value = false;
});
</script>