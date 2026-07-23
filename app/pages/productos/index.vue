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
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p class="font-mono text-xs uppercase tracking-widest text-cocoa">
            Catálogo
        </p>
        <h1 class="mt-2 font-display text-4xl font-semibold text-espresso">
            Nuestros sabores
        </h1>
        <p class="mt-3 max-w-xl text-espresso/60">
            Porciones individuales de 150 g. Elige tu favorito y agrégalo al
            carrito.
        </p>

        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Core -->
            <ProductCard v-for="p in core" :key="p.id" :product="p" />
        </div>

        <div v-if="seasonal.length > 0">
            <div class="mt-16">
                <StrataDivider />
            </div>
            <div class="mt-12">
                <p class="font-mono text-xs uppercase tracking-widest text-saffron">
                    Temporada
                </p>
                <h2 class="mt-2 font-display text-2xl font-semibold text-espresso">
                    Ediciones especiales
                </h2>
            </div>
            <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ProductCard v-for="p in seasonal" :key="p.id" :product="p" featured />
            </div>
        </div>
    </div>
</template>
