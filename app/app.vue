<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 font-sans">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold leading-tight text-gray-900 mb-4">
          Veille REST vs GraphQL (ERP)
        </h1>
        <nav class="flex space-x-4 text-sm font-medium flex-wrap">
          <NuxtLink to="/" class="text-indigo-600 hover:text-indigo-900 mb-2" active-class="underline">Accueil</NuxtLink>
          <NuxtLink to="/benchmark" class="text-indigo-600 hover:text-indigo-900 mb-2" active-class="underline">CRUD</NuxtLink>

          <!-- Liens ERP REST -->
          <div class="h-5 border-l border-gray-300 mx-2 hidden sm:block"></div>
          <NuxtLink to="/erp/rest/clients" class="text-blue-600 hover:text-blue-900 mb-2" active-class="underline">Clients REST</NuxtLink>
          <NuxtLink to="/erp/rest/client" class="text-blue-600 hover:text-blue-900 mb-2" active-class="underline">Dashboard REST</NuxtLink>
          <NuxtLink to="/erp/rest/facture" class="text-blue-600 hover:text-blue-900 mb-2 font-bold" active-class="underline">Facture+OF REST</NuxtLink>

          <!-- Liens ERP GraphQL -->
          <div class="h-5 border-l border-gray-300 mx-2 hidden sm:block"></div>
          <NuxtLink to="/erp/graphql/clients" class="text-pink-600 hover:text-pink-900 mb-2" active-class="underline">Clients GQL</NuxtLink>
          <NuxtLink to="/erp/graphql/dashboard" class="text-pink-600 hover:text-pink-900 mb-2" active-class="underline">Dashboard GQL</NuxtLink>
          <NuxtLink to="/erp/graphql/facture" class="text-pink-600 hover:text-pink-900 mb-2 font-bold" active-class="underline">Facture+OF GQL</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <NuxtPage />
    </main>
  </div>
</template>
