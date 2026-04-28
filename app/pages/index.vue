<template>
  <div class="px-4 py-8 max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Comparatif REST vs GraphQL</h1>
      <p class="text-gray-600">Scénario 1 : Détail d'une commande complexe (Commande + Client + Lignes + Produits)</p>
    </div>

    <div class="mb-6 flex space-x-4 items-center">
      <label for="orderId" class="block text-sm font-medium text-gray-700">ID de la commande à tester :</label>
      <button
        @click="runComparison"
        :disabled="isFetching"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        Lancer le test
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Section REST -->
      <div>
        <h2 class="text-2xl font-bold mb-4 flex items-center">
          <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded uppercase mr-2 tracking-wide">REST</span>
          API (Strapi natif)
        </h2>

        <ResponseMetrics
          title="Performances REST"
          :metrics="restResult?.metrics"
          :data="restResult?.data"
          :loading="restLoading"
          :error="restError"
        />
      </div>

      <!-- Section GraphQL -->
      <div>
        <h2 class="text-2xl font-bold mb-4 flex items-center">
          <span class="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded uppercase mr-2 tracking-wide">GraphQL</span>
          API
        </h2>

        <ResponseMetrics
          title="Performances GraphQL"
          :metrics="graphqlResult?.metrics"
          :data="graphqlResult?.data"
          :loading="graphqlLoading"
          :error="graphqlError"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ResponseMetrics from '~/components/metrics/ResponseMetrics.vue';
import { useGraphqlApi } from "~/composables/useGraphqlApi";
import { useRestApi } from "~/composables/useRestApi";

const { getOrderDetails: getRestOrderDetails } = useRestApi();
const { getOrderDetails: getGraphqlOrderDetails } = useGraphqlApi();

const isFetching = ref(false);

const restResult = ref(null);
const restLoading = ref(false);
const restError = ref(null);

const graphqlResult = ref(null);
const graphqlLoading = ref(false);
const graphqlError = ref(null);

const runComparison = async () => {
  isFetching.value = true;

  // Reset states
  restResult.value = null;
  graphqlResult.value = null;
  restError.value = null;
  graphqlError.value = null;

  // Run REST test
  restLoading.value = true;
  try {
    restResult.value = await getRestOrderDetails();
  } catch (e: any) {
    restError.value = e;
  } finally {
    restLoading.value = false;
  }

  // Run GraphQL test
  graphqlLoading.value = true;
  try {
    graphqlResult.value = await getGraphqlOrderDetails();
  } catch (e: any) {
    graphqlError.value = e;
  } finally {
    graphqlLoading.value = false;
  }

  isFetching.value = false;
};
</script>
