<script setup lang="ts">
import CartButton from './CartButton.vue';
const navLinks = [
    { href: "/productos", label: "Sabores" },
    { href: "/carrito", label: "Carrito" },
];
</script>

<template>
    <header class="sticky top-0 z-50 border-b border-espresso/10 bg-mascarpone/95 backdrop-blur-sm">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <a href="/" class="group flex flex-col">
                <span
                    class="font-display text-2xl font-semibold tracking-tight text-espresso transition-colors group-hover:text-cocoa">
                    Manjarmio
                </span>
                <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-espresso/50">
                    Tiramisú · Cali
                </span>
            </a>

            <nav class="flex items-center gap-6">
                <a v-for="link in navLinks" :href="link.href" :key="link.href"
                    class="hidden text-sm font-medium text-espresso/70 transition-colors hover:text-espresso sm:block">
                    {{ link.label }}
                </a>
                <CartButton />
            </nav>
        </div>
    </header>
</template>