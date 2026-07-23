<script setup lang="ts">
import StrataDivider from '~/components/StrataDivider.vue';
import ProductCard from '~/components/ProductCard.vue';

const productsApi = useProducts()
const { data } = await useAsyncData('products', () => productsApi.getAll())
const products = ref<Product[]>([])
products.value = data.value ?? []

const isSeasonal = (product: Product) =>
    product.is_seasonal === true || product.is_seasonal === 'true';
const core = products.value.filter((product) => !isSeasonal(product));
const seasonal = products.value.filter((product) => isSeasonal(product));

</script>

<template>
    <section class="relative overflow-hidden bg-espresso text-mascarpone">
        <div class="absolute inset-0 opacity-20">
            <div class="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-saffron blur-3xl" />
            <div class="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-botanical blur-3xl" />
        </div>
        <div class="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
            <p class="font-mono text-xs uppercase tracking-[0.3em] text-saffron">
                Cali, Colombia
            </p>
            <h1 class="mt-4 max-w-2xl font-display text-5xl font-semibold leading-tight sm:text-6xl">
                Tiramisú artesanal, capa por capa
            </h1>
            <p class="mt-6 max-w-xl text-lg text-mascarpone/75">
                Cinco sabores permanentes y ediciones de temporada. Hecho en Cali
                con mascarpone cremoso, café de origen y el toque dulce que solo
                Manjarmio le pone.
            </p>
            <div class="mt-10 flex flex-wrap gap-4">
                <a href="/productos"
                    class="rounded-full bg-saffron px-8 py-3 text-sm font-semibold text-espresso transition-colors hover:bg-saffron/90">
                    Ver sabores
                </a>
                <a href="/carrito"
                    class="rounded-full border border-mascarpone/30 px-8 py-3 text-sm font-medium text-mascarpone transition-colors hover:bg-mascarpone/10">
                    Hacer pedido
                </a>
            </div>
        </div>
        <StrataDivider />
    </section>

    <section class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div class="flex items-end justify-between gap-4">
            <div>
                <p class="font-mono text-xs uppercase tracking-widest text-cocoa">
                    Nuestros sabores
                </p>
                <h2 class="mt-2 font-display text-3xl font-semibold text-espresso">
                    Los favoritos de Cali
                </h2>
            </div>
            <a href="/productos" class="hidden text-sm font-medium text-cocoa hover:underline sm:block">
                Ver todos →
            </a>
        </div>
        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ProductCard v-for="p in core" :key="p.id" :product="p" />
        </div>
    </section>

    <section v-if="seasonal.length > 0" class="bg-mascarpone/50 py-20">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
            <StrataDivider />
            <div class="mt-12">
                <p class="font-mono text-xs uppercase tracking-widest text-saffron">
                    Edición limitada
                </p>
                <h2 class="mt-2 font-display text-3xl font-semibold text-espresso">
                    Sabor de temporada
                </h2>
                <p class="mt-2 max-w-lg text-espresso/60">
                    Cada estación trae una receta nueva. Disponible mientras duren
                    existencias.
                </p>
            </div>
            <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ProductCard v-for="p in seasonal" :key="p.id" :product="p" featured />
            </div>
        </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div class="grid gap-8 rounded-3xl bg-botanical p-8 text-mascarpone sm:grid-cols-3 sm:p-12">
            <div>
                <p class="font-mono text-3xl font-semibold text-saffron">5+</p>
                <p class="mt-1 text-sm text-mascarpone/70">
                    Sabores permanentes
                </p>
            </div>
            <div>
                <p class="font-mono text-3xl font-semibold text-saffron">
                    100%
                </p>
                <p class="mt-1 text-sm text-mascarpone/70">Artesanal en Cali</p>
            </div>
            <div>
                <p class="font-mono text-3xl font-semibold text-saffron">
                    Nequi
                </p>
                <p class="mt-1 text-sm text-mascarpone/70">
                    Transferencia · Efectivo
                </p>
            </div>
        </div>
    </section>
</template>
