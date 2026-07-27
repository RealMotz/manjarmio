// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    // The private keys which are only available within server-side

    // Keys within public, will be also exposed to the client-side
    public: {
      pickupAddress: process.env.PICKUP_ADDRESS,
      pickupAddress2: process.env.PICKUP_ADDRESS2,
      pickupHours: process.env.PICKUP_HOURS,
      workingHoursStart: process.env.WORKING_HOURS_START ?? "07:00",
      workingHoursEnd: process.env.WORKING_HOURS_END ?? "15:00",
      deliveryHoursStart: process.env.DELIVERY_HOURS_START ?? "09:00",
      deliveryHoursEnd: process.env.DELIVERY_HOURS_END ?? "18:00",
      supabaseUrl: process.env.SUPABASE_URL,
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
    },
  },
});
