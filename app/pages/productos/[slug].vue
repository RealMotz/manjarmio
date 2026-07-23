<script setup lang="ts">
import { formatCOP } from '~/utils/currency';

// export const dynamic = "force-dynamic";

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug

if (!slug) {
    throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado' })
}

const productsApi = useProducts()
const { data } = await useAsyncData(`product-${slug}`, () => productsApi.getProductBySlug(slug))

const product = ref<any>()
product.value = data.value;
const { addProduct } = useCart();
const added = ref(false);
const isSeasonal = computed(
    () => product.value?.is_seasonal === true || product.value?.is_seasonal === 'true',
);

const addToCart = () => {
    addProduct(product.value);
    added.value = true;
    window.setTimeout(() => {
        added.value = false;
    }, 1600);
};

// export async function generateMetadata({ params }: PageProps) {
//     const { slug } = await params;
//     const productsApi = useProducts()
//     const { data } = await useAsyncData('products', () => productsApi.getProductBySlug(slug))
//     if (!data.value) return { title: "Producto no encontrado" };
//     return {
//         title: `${product.name} | Manjarmio`,
//         description: product.description,
//     };
// }

</script>


<template>
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <a href="/productos" class="text-sm font-medium text-cocoa hover:underline">
            ← Volver al catálogo
        </a>

        <div class="mt-8 grid gap-10 lg:grid-cols-2">
            <div
                class="relative aspect-square overflow-hidden rounded-3xl bg-linear-to-br from-mascarpone to-espresso/5">
                <img v-if="product.image_url" :src="product.image_url" :alt="product.name"
                    class="h-full w-full object-cover" />
                <div v-else class="flex h-full items-center justify-center">
                    <span class="font-display text-8xl text-espresso/15">
                        {{ product.name.charAt(0) }}
                    </span>
                </div>
                <span v-if="isSeasonal"
                    class="absolute left-4 top-4 rounded-full bg-saffron px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-espresso">
                    Temporada
                </span>
            </div>

            <div class="flex flex-col">
                <p class="font-mono text-xs uppercase tracking-widest text-cocoa">
                    Porción individual · 200 g
                </p>
                <h1 class="mt-2 font-display text-4xl font-semibold text-espresso">
                    {{ product.name }}
                </h1>
                <p class="mt-2 font-mono text-xl text-espresso">
                    {{ formatCOP(product.price_cents) }}
                </p>
                <p class="mt-6 flex-1 text-espresso/70 leading-relaxed">
                    {{ product.description }}
                </p>
                <div class="mt-8">
                    <button type="button" @click="addToCart"
                        class="rounded-full bg-espresso px-7 py-3 text-sm font-semibold text-mascarpone transition-colors hover:bg-cocoa focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cocoa">
                        {{ added ? 'Agregado al carrito' : 'Agregar al carrito' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
