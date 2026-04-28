// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      restUrl: process.env.NUXT_PUBLIC_REST_URL || 'http://localhost:1337/api',
      graphqlUrl: process.env.NUXT_PUBLIC_GRAPHQL_URL || 'http://localhost:1337/graphql'
    }
  }
})