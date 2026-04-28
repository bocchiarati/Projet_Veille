<template>
  <div class="px-4 py-8 max-w-7xl mx-auto relative">
    <div class="mb-8 border-b pb-4 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-blue-900 mb-2">Fiche Client - Vue REST</h1>
        <p class="text-gray-600">Détails du client et historique des commandes (Relation 1:N).</p>
      </div>
      <div class="text-right">
        <NuxtLink :to="`/erp/graphql/client?id=${clientId}`" class="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-300 transition-colors">
          Basculer vers GraphQL &rarr;
        </NuxtLink>
      </div>
    </div>

    <!--
      ANALYSE DX :
      En REST, récupérer l'historique nécessite un ?populate[commandes]=* (ou un deuxième appel GET).
      Le populate alourdit le payload de base de l'objet client.
    -->

    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
      <p class="mt-4 text-gray-500">Chargement de la Fiche Client via REST...</p>
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
          <li v-for="cmd in client.commandes" :key="cmd.id" class="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <div>
              <p class="text-sm font-medium text-blue-600 truncate">Commande N° {{ cmd.documentId }}</p>
              <p class="text-sm text-gray-500">Date : {{ new Date(cmd.date_commande).toLocaleDateString() }}</p>
            </div>
            <div>
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                {{ cmd.statut }}
              </span>
            </div>
          </li>
          <li v-if="!client.commandes?.length" class="px-6 py-4 text-center text-gray-500">Aucune commande passée</li>
        </ul>
      </div>
    </div>

    <!-- Outil de Mesure Injecté -->
    <MetricOverlay method="REST" :metrics="metrics" />
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
  try {
    loading.value = true;

    // Construction de l'URL propre
    // Note : On retire le populate=* pour ne prendre que les commandes comme dans ton test réussi
    const baseUrl = config.public.restUrl.replace(/\/$/, ""); // Sécurité : on enlève le slash final s'il existe
    const url = clientId
        ? `${baseUrl}/clients/${clientId}?populate=commandes`
        : `${baseUrl}/clients?populate=commandes&pagination[limit]=1`;

    // APPEL REST (Toujours en GET)
    const calls = [() => $fetch.raw(url, { method: 'GET' })];
    const result = await measureCalls(calls);

    // ANALYSE DE LA RÉPONSE (Basée sur ton Postman)
    if (result) {
      // Dans ton Postman, le client est DIRECTEMENT dans result.data
      if (clientId) {
        client.value = result.data;
      } else {
        // Cas du fallback si pas d'ID : Strapi renvoie un tableau dans .data
        client.value = Array.isArray(result.data) ? result.data[0] : result.data;
      }

      // Sync de l'ID pour l'UI
      if (client.value && !clientId) {
        route.query.id = client.value.documentId;
      }
    }
  } catch (err: any) {
    console.error("🚨 Erreur 400 REST :", err.response?._data || err);
  } finally {
    loading.value = false;
  }
});
</script>