// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    secret: '',
    public: {
    },
    private: {
      MONGODB_URL: process.env.NUXT_PRIVATE_MONGODB_ADDRESS,
      PROVIDER_URL: process.env.NUXT_PRIVATE_PROVIDER_URL,
      PRIVATE_KEY: process.env.NUXT_PRIVATE_PRIVATE_KEY,
      PRIVATE_KEY_USER: process.env.NUXT_PRIVATE_PRIVATE_KEY_USER,
      DO_UPDATE_EPOCH: process.env.NUXT_PRIVATE_DO_UPDATE_EPOCH,
      DO_BUY_ETH_BOT: process.env.NUXT_PRIVATE_DO_BUY_ETH_BOTS,
    }
  },
  devtools: { enabled: true },
  nitro: {
    plugins: ["~/server/index.ts"],
  },
  // mongoose: {
  //   uri: process.env.NUXT_PRIVATE_MONGODB_ADDRESS,
  //   options: {},
  //   modelsDir: 'models',
  // },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-scheduler'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
