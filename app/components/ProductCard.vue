<script setup lang="ts">
import { formatCOP } from "~/utils/currency";

type ProductCardProps = {
    product: Product;
    featured?: boolean;
};

const props = defineProps<ProductCardProps>()
const { addProduct } = useCart();
const added = ref(false);
const isSeasonal = computed(() =>
    props.product.is_seasonal === true || props.product.is_seasonal === 'true',
);

const addToCart = () => {
    addProduct(props.product);
    added.value = true;
    window.setTimeout(() => {
        added.value = false;
    }, 1600);
};
</script>


<template>
    <article
        :class="`group flex flex-col overflow-hidden rounded-2xl border border-espresso/10 bg-white transition-shadow hover:shadow-lg ${props.featured ? 'ring-1 ring-saffron/30' : ''}`">
        <NuxtLink :to="`/productos/${props.product.slug}`" class="block">
            <div class="relative aspect-4/3 bg-linear-to-br from-mascarpone to-espresso/5">
                <img v-if="props.product.image_url" :src="props.product.image_url" :alt="props.product.name"
                    class="h-full w-full object-cover" />
                <div v-else class="flex h-full items-center justify-center">
                    <span class="font-display text-4xl text-espresso/20">
                        {{ props.product.name.charAt(0) }}
                    </span>
                </div>
                <span v-if="isSeasonal"
                    class="absolute left-3 top-3 rounded-full bg-saffron px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-espresso">
                    Temporada
                </span>
            </div>
        </NuxtLink>

        <div class="flex flex-1 flex-col p-5">
            <NuxtLink :to="`/productos/${product.slug}`">
                <h3 class="font-display text-xl font-semibold text-espresso group-hover:text-cocoa">
                    {{ props.product.name }}
                </h3>
            </NuxtLink>
            <p class="mt-2 line-clamp-2 flex-1 text-sm text-espresso/60">
                {{ props.product.description }}
            </p>
            <div class="mt-4 flex items-center justify-between gap-3">
                <span class="font-mono text-sm font-medium text-espresso">
                    {{ formatCOP(Number(props.product.price_cents)) }}
                </span>
                <button type="button" @click="addToCart"
                    class="rounded-full bg-espresso px-4 py-2 text-xs font-semibold text-mascarpone transition-colors hover:bg-cocoa focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cocoa">
                    {{ added ? 'Agregado' : 'Agregar' }}
                </button>
            </div>
        </div>
    </article>
</template>
