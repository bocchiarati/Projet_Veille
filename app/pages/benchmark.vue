<template>
  <div class="px-4 py-8 max-w-7xl mx-auto">
    <div class="mb-8 border-b pb-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Benchmark CRUD Complet: REST vs GraphQL</h1>
      <p class="text-gray-600">Environnement: Strapi 5 (Utilisation des documentId)</p>
    </div>

    <!-- Actions -->
    <div class="bg-gray-50 p-4 rounded-lg mb-8 flex flex-wrap gap-4 items-end shadow-sm">
      <div class="w-full md:w-1/4">
        <label class="block text-sm font-medium text-gray-700 mb-1">ID Client (Mock)</label>
        <input v-model="mockClientDocId" class="w-full border-gray-300 rounded-md shadow-sm p-2 border" />
      </div>
      <div class="w-full md:w-1/4">
        <label class="block text-sm font-medium text-gray-700 mb-1">ID Produit (Mock)</label>
        <input v-model="mockProductDocId" class="w-full border-gray-300 rounded-md shadow-sm p-2 border" />
      </div>
      <div>
        <button @click="runFullBenchmark" :disabled="isRunning" class="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {{ isRunning ? 'Exécution en cours...' : 'Lancer le Benchmark (R-C-U-D)' }}
        </button>
      </div>
    </div>

    <!-- Résultats de Performance -->
    <div v-if="results.length > 0" class="mb-12">
      <h2 class="text-2xl font-bold mb-4">Résultats des Performances</h2>
      <div class="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Opération</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Temps (ms)</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Poids (KB)</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <template v-for="(res, index) in results" :key="index">
              <tr :class="res.name.includes('REST') ? 'bg-blue-50/30' : 'bg-pink-50/30'">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                  <span :class="res.name.includes('REST') ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'" class="px-2 py-0.5 rounded text-xs mr-2">{{ res.name.includes('REST') ? 'REST' : 'GQL' }}</span>
                  {{ res.name.replace('REST - ', '').replace('GraphQL - ', '') }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-mono">{{ res.durationMs.toFixed(2) }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-mono">{{ res.sizeKb.toFixed(2) }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm">
                  <span v-if="!res.error" class="text-green-600">✅ Succès</span>
                  <span v-else class="text-red-600 cursor-help" :title="res.error">❌ Échec</span>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm">
                  <button
                    @click="toggleDetails(index)"
                    class="text-indigo-600 hover:text-indigo-900 text-xs font-medium underline"
                  >
                    {{ expandedRow === index ? 'Masquer' : 'Voir la réponse' }}
                  </button>
                </td>
              </tr>
              <!-- Expanded Detail Row -->
              <tr v-if="expandedRow === index" class="bg-gray-50">
                <td colspan="5" class="px-4 py-4">
                  <div class="text-sm">
                    <p class="font-semibold text-gray-700 mb-2">Payload brut :</p>
                    <pre class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto max-h-96 text-xs font-mono whitespace-pre-wrap">{{ JSON.stringify(res.data, null, 2) }}</pre>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Analyse DX -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold mb-4">Analyse Developer Experience (DX) & Type Safety</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- REST DX -->
        <div class="bg-white p-6 rounded-lg shadow border-t-4 border-blue-500">
          <h3 class="text-xl font-bold mb-4 text-blue-800">API REST (Natifs Strapi)</h3>
          <ul class="space-y-4 text-sm text-gray-700">
            <li>
              <strong>Lisibilité (Fetch Relations) :</strong> 🟠 Moyenne. <br/>
              La syntaxe <code>?populate[orderLines][populate][product]=*</code> devient vite illisible et propice aux erreurs de frappe (Magic Strings).
            </li>
            <li>
              <strong>Maintenabilité (Ajout de champ) :</strong> 🔴 Difficile.<br/>
              Si on ajoute le "poids du produit", REST renverra le poids <em>partout</em> où le produit est "populé", causant de l'over-fetching involontaire sur des écrans qui n'en ont pas besoin.
            </li>
            <li>
              <strong>Type Safety (TS) :</strong> 🟠 Moyen.<br/>
              Les types de retours REST de Strapi sont complexes (ex: <code>data.attributes.client.data.attributes...</code>) et difficiles à générer proprement côté front. Il faut souvent les taper manuellement.
            </li>
            <li>
              <strong>Tests & Mocking :</strong> 🟢 Facile.<br/>
              Mocker un appel REST (ex: via MSW) est standard. On intercepte l'URL <code>/api/orders</code>.
            </li>
          </ul>
        </div>

        <!-- GraphQL DX -->
        <div class="bg-white p-6 rounded-lg shadow border-t-4 border-pink-500">
          <h3 class="text-xl font-bold mb-4 text-pink-800">GraphQL (Shadow CRUD)</h3>
          <ul class="space-y-4 text-sm text-gray-700">
            <li>
              <strong>Lisibilité (Fetch Relations) :</strong> 🟢 Excellente.<br/>
              La structure de la requête reflète exactement le JSON attendu en retour. La hiérarchie est claire.
            </li>
            <li>
              <strong>Maintenabilité (Ajout de champ) :</strong> 🟢 Excellente.<br/>
              Ajouter le champ <code>weight</code> dans une seule query spécifique n'impacte pas le reste de l'application (pas d'over-fetching).
            </li>
            <li>
              <strong>Type Safety (TS) :</strong> 🟢 Excellente.<br/>
              Des outils comme GraphQL Code Generator créent automatiquement les types TypeScript à 100% fiables en lisant le schéma GraphQL.
            </li>
            <li>
              <strong>Tests & Mocking :</strong> 🟢 Facile.<br/>
              Des outils dédiés (Apollo MockProvider ou urql) facilitent le mock en se basant sur le nom de l'opération (<code>GetOrders</code>). MSW gère aussi nativement le GraphQL.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCrudBenchmark } from '~/composables/useCrudBenchmark';

const {
  executeReadWithRest, executeReadWithGraphql,
  executeCreateWithRest, executeCreateWithGraphql,
  executeUpdateWithRest, executeUpdateWithGraphql,
  executeDeleteWithRest, executeDeleteWithGraphql
} = useCrudBenchmark();

// Remplacer par de vrais documentIds existants dans votre Strapi
const mockClientDocId = ref('client_doc_id_123');
const mockProductDocId = ref('product_doc_id_456');

const isRunning = ref(false);
const results = ref<any[]>([]);
const expandedRow = ref<number | null>(null);

const toggleDetails = (index: number) => {
  if (expandedRow.value === index) {
    expandedRow.value = null; // Cacher si c'est déjà ouvert
  } else {
    expandedRow.value = index; // Afficher les détails de cette ligne
  }
};

const safeRun = async (fn: () => Promise<any>) => {
  try {
    return await fn();
  } catch (err: any) {
    return { name: 'Erreur', durationMs: 0, sizeKb: 0, error: err.message || 'Unknown error', data: null };
  }
};

const runFullBenchmark = async () => {
  isRunning.value = true;
  results.value = [];
  expandedRow.value = null;

  // ================= 1. READ =================
  const resReadRest = await safeRun(executeReadWithRest);
  results.value.push(resReadRest);

  const resReadGql = await safeRun(executeReadWithGraphql);
  results.value.push(resReadGql);

  // ================= 2. CREATE =================
  const resCreateRest = await safeRun(() => executeCreateWithRest(mockClientDocId.value, mockProductDocId.value));
  results.value.push(resCreateRest);
  const createdRestDocId = resCreateRest.data?.data?.documentId || null;

  const resCreateGql = await safeRun(() => executeCreateWithGraphql(mockClientDocId.value, mockProductDocId.value));
  results.value.push(resCreateGql);
  // Attention à la structure GraphQL de Strapi pour récupérer l'ID
  const createdGqlDocId = resCreateGql.data?.data?.createCommande?.documentId || null;

  // ================= 3. UPDATE =================
  if (createdRestDocId) {
    const mockOrderLines = [{ quantity: 5, product: mockProductDocId.value }];
    const resUpdateRest = await safeRun(() => executeUpdateWithRest(createdRestDocId, mockOrderLines));
    results.value.push(resUpdateRest);
  }

  if (createdGqlDocId) {
    const mockOrderLines = [{ quantity: 5, product: mockProductDocId.value }];
    const resUpdateGql = await safeRun(() => executeUpdateWithGraphql(createdGqlDocId, mockOrderLines));
    results.value.push(resUpdateGql);
  }

  // ================= 4. DELETE =================
  if (createdRestDocId) {
    const resDeleteRest = await safeRun(() => executeDeleteWithRest(createdRestDocId));
    results.value.push(resDeleteRest);
  }

  if (createdGqlDocId) {
    const resDeleteGql = await safeRun(() => executeDeleteWithGraphql(createdGqlDocId));
    results.value.push(resDeleteGql);
  }

  isRunning.value = false;
};
</script>