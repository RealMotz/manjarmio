<script setup lang="ts">

const config = useRuntimeConfig();
const pickupAddress = config.public.pickupAddress ?? "Cali, Valle del Cauca";
const pickupAddress2 = config.public.pickupAddress2 ?? "";
const pickupHours = config.public.pickupHours ?? "";
</script>

<template>
    <footer class="mt-auto border-t border-espresso/10 bg-espresso text-mascarpone">
        <div class="strata-divider bg-espresso" aria-hidden />
        <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div class="grid gap-8 sm:grid-cols-3">
                <div>
                    <p class="font-display text-xl font-semibold">Manjarmio</p>
                    <p class="mt-2 text-sm text-mascarpone/70">
                        Tiramisú artesanal hecho en Cali. Cuatro sabores permanentes y
                        ediciones de temporada.
                    </p>
                </div>
                <div>
                    <p class="font-mono text-xs uppercase tracking-widest text-saffron">
                        Recogida
                    </p>
                    <p class="mt-2 text-sm text-mascarpone/80">{{ pickupAddress }}</p>
                    <p class="mt-2 text-sm text-mascarpone/80">{{ pickupAddress2 }}</p>
                    <p class="mt-1 text-sm text-mascarpone/60">{{ pickupHours }}</p>
                </div>
                <div>
                    <p class="font-mono text-xs uppercase tracking-widest text-saffron">
                        Pagos
                    </p>
                    <p class="mt-2 text-sm text-mascarpone/80">
                        Nequi, llave o transferencia bancaria.
                    </p>
                </div>
            </div>
            <p class="mt-10 border-t border-mascarpone/10 pt-6 text-center text-xs text-mascarpone/40">
                © {{ new Date().getFullYear() }} Manjarmio · Cali, Colombia
            </p>
        </div>
    </footer>
</template>
