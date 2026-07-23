<script setup lang="ts">
import Header from './components/AppHeader.vue';
import Footer from './components/AppFooter.vue';

useHead({
  bodyAttrs: {
    class: 'flex min-h-full flex-col'
  }
})

</script>

<template>
  <div>
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>
