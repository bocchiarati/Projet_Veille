<template>
  <div class="px-4 py-8 max-w-7xl mx-auto relative">
    <div class="mb-8 border-b pb-4 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-blue-900 mb-2">Détail Facture - Vue REST</h1>
        <p class="text-gray-600">Cas Complexe: Client + Lignes + Produits + Action Métier (OF).</p>
      </div>
      <div class="text-right">
        <NuxtLink :to="`/erp/graphql/facture?id=${factureId}`" class="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-300 transition-colors">
          Basculer vers GraphQL &rarr;
        </NuxtLink>
      </div>
    </div>

    <!--
      ANALYSE DX & ROBUSTESSE:
      En REST, le paramètre `populate[ligne_commandes][populate][produit]=*` peut
      poser des soucis de circularité ou de profondeur maximum autorisée par Strapi.
      L'action métier (POST /api/ligne-commandes/:id/create-of) nécessite de créer un endpoint custom en back,
      tandis qu'en GraphQL on a juste branché un resolver métier. Le typage côté front de ce POST est manuel (fragile).
    -->

    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
      <p class="mt-4 text-gray-500">Chargement de la Facture (REST)...</p>
    </div>

    <div v-else-if="!facture" class="text-center py-20 text-red-500">
      Facture introuvable.
    </div>

    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-start">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">Commande N° {{ facture.documentId }}</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Date : {{ new Date(facture.date_commande).toLocaleDateString() }}</p>
        </div>
        <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          {{ facture.statut }}
        </span>
      </div>

      <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl class="sm:divide-y sm:divide-gray-200">
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Client Facturé</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span class="font-bold">{{ facture.client?.nom || 'Inconnu' }}</span>
            </dd>
          </div>

          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Détails de Production (Lignes)</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <ul class="border border-gray-200 rounded-md divide-y divide-gray-200">
                <li v-for="ligne in facture.ligne_commandes" :key="ligne.documentId" class="pl-3 pr-4 py-4 flex flex-col md:flex-row md:items-center justify-between text-sm">
                  <div class="flex-1 mb-2 md:mb-0">
                    <p class="font-medium text-gray-900">{{ ligne.quantite }}x {{ ligne.produit?.nom || 'Produit inconnu' }}</p>
                    <p class="text-gray-500 font-mono mt-1 text-xs">Réf Ligne: {{ ligne.documentId }}</p>
                  </div>

                  <!-- Bouton Action Métier (Production) -->
                  <div class="flex items-center space-x-4">
                    <span class="font-mono text-gray-600">{{ ligne.produit?.prix }} €</span>
                    <button
                      @click="createOF(ligne.documentId)"
                      :disabled="isCreatingOF === ligne.documentId"
                      class="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <span v-if="isCreatingOF === ligne.documentId" class="animate-pulse">...</span>
                      <span v-else>Lancer l'OF (REST)</span>
                    </button>
                  </div>
                </li>
                <li v-if="!facture.ligne_commandes?.length" class="pl-3 pr-4 py-3 text-gray-500">Aucune ligne associée</li>
              </ul>
            </dd>
          </div>

          <!-- Section feedback suite à la création d'OF -->
          <div v-if="lastCreatedOF" class="bg-green-50 px-6 py-4">
            <p class="text-sm text-green-800 font-medium">✅ OF Créé avec succès :</p>
            <p class="text-xs text-green-700 mt-1 font-mono">Réf: {{ lastCreatedOF.reference }} | Statut: {{ lastCreatedOF.statut }}</p>
          </div>

          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
            <dt class="text-sm font-bold text-gray-900">Total estimé</dt>
            <dd class="mt-1 text-lg font-bold text-gray-900 sm:mt-0 sm:col-span-2 font-mono">
              {{ total }} €
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Outil de Mesure Injecté -->
    <MetricOverlay method="REST" :metrics="metrics" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePageMetrics } from '~/composables/usePageMetrics';
import MetricOverlay from '~/components/MetricOverlay.vue';

const { metrics, measureCalls } = usePageMetrics();
const config = useRuntimeConfig();
const route = useRoute();

const facture = ref<any>(null);
const loading = ref(true);
const factureId = route.query.id as string || '';

const isCreatingOF = ref<string | null>(null);
const lastCreatedOF = ref<any>(null);

const total = computed(() => {
  if (!facture.value || !facture.value.ligne_commandes) return 0;
  return facture.value.ligne_commandes.reduce((acc: number, ligne: any) => {
    return acc + ((ligne.quantite || 0) * (ligne.produit?.prix || 0));
  }, 0);
});

const loadFacture = async () => {
  // On remplace le populate=* par une sélection précise pour éviter le ValidationError
  const queryParams = "populate[client][fields][0]=nom&populate[ligne_commandes][populate][produit][fields][0]=nom&populate[ligne_commandes][populate][produit][fields][1]=prix";

  const url = factureId
      ? `${config.public.restUrl}/commandes/${factureId}?${queryParams}`
      : `${config.public.restUrl}/commandes?${queryParams}&pagination[limit]=1`;

  const calls = [() => $fetch.raw(url)];
  const result = await measureCalls(calls);

  if (result?.data) {
    // Gestion de l'enveloppe data de Strapi 5
    facture.value = Array.isArray(result.data) ? result.data[0] : result.data;

    if (facture.value && !factureId) {
      route.query.id = facture.value.documentId;
    }
  }
};

const createOF = async (ligneId: string) => {
  isCreatingOF.value = ligneId;
  lastCreatedOF.value = null;

  try {
    // Action Métier REST : appel au endpoint custom
    // En REST, ce endpoint n'est pas auto-typé, le développeur doit connaître par coeur ce qu'il retourne.
    const res: any = await $fetch(`${config.public.restUrl}/ligne-commandes/${ligneId}/create-of`, {
      method: 'POST'
    });

    lastCreatedOF.value = res.data?.attributes || res.data || res;

    // UX : Souvent en REST, pour rafraîchir la vue, on doit relancer la requête GET globale (1 nouveau round trip complet)
    // Ici on simule que l'action s'est bien passée.
  } catch (e: any) {
    alert(`Erreur création OF : ${e.message}`);
  } finally {
    isCreatingOF.value = null;
  }
};

onMounted(async () => {
  await loadFacture();
  loading.value = false;
});
</script>