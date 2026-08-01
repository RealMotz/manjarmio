<script setup lang="ts">
import Header from '../components/AppHeader.vue';
import Footer from '../components/AppFooter.vue';
</script>

<template>
    <div>
        <Header />
        <slot />
        <Footer />
    </div>
</template>
