<script setup lang="ts">

const config = useRuntimeConfig();
const pickupAddress = config.public.pickupAddress ?? "Cali, Valle del Cauca";
const pickupHours = config.public.pickupHours ?? "Lun-Sáb 10:00-18:00";
</script>

<template>
    <footer class="mt-auto border-t border-espresso/10 bg-espresso text-mascarpone">
        <div class="strata-divider bg-espresso" aria-hidden />
        <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div class="grid gap-8 sm:grid-cols-3">
                <div>
                    <p class="font-display text-xl font-semibold">Manjarmio</p>
                    <p class="mt-2 text-sm text-mascarpone/70">
                        Tiramisú artesanal hecho en Cali. Cinco sabores permanentes y
                        ediciones de temporada.
                    </p>
                </div>
                <div>
                    <p class="font-mono text-xs uppercase tracking-widest text-saffron">
                        Recogida
                    </p>
                    <p class="mt-2 text-sm text-mascarpone/80">{{ pickupAddress }}</p>
                    <p class="mt-1 text-sm text-mascarpone/60">{{ pickupHours }}</p>
                </div>
                <div>
                    <p class="font-mono text-xs uppercase tracking-widest text-saffron">
                        Pagos
                    </p>
                    <p class="mt-2 text-sm text-mascarpone/80">
                        Nequi, transferencia bancaria o efectivo al recibir.
                    </p>
                </div>
            </div>
            <p class="mt-10 border-t border-mascarpone/10 pt-6 text-center text-xs text-mascarpone/40">
                © {{ new Date().getFullYear() }} Manjarmio · Cali, Colombia
            </p>
        </div>
    </footer>
</template>
