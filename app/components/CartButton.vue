<script setup lang="ts">
const { itemCount, hasHydrated } = useCart();
</script>

<template>
    <NuxtLink to="/carrito"
        class="relative inline-flex items-center gap-2 rounded-full bg-espresso px-4 py-2 text-sm font-medium text-mascarpone transition-colors hover:bg-cocoa">
        Carrito
        <span v-if="hasHydrated && itemCount > 0"
            class="flex h-5 min-w-5 items-center justify-center rounded-full bg-saffron px-1.5 font-mono text-xs font-semibold text-espresso">
            {{ itemCount }}
        </span>
    </NuxtLink>
</template>
