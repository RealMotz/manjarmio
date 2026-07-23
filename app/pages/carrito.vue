<script setup lang="ts">
import { formatCOP } from "~/utils/currency";

type Fulfillment = "pickup" | "delivery";

const config = useRuntimeConfig();
const {
  items,
  hasHydrated,
  subtotalCents,
  updateQuantity,
  removeItem,
} = useCart();
const deliveryZonesApi = useDeliveryZones();

const {
  data: deliveryZones,
  pending: deliveryZonesPending,
  error: deliveryZonesError,
} = await useAsyncData("active-delivery-zones", () => deliveryZonesApi.getActive());

const fulfillment = ref<Fulfillment>("pickup");
const selectedZoneId = ref<string | null>(null);
const checkoutMessage = ref("");
const contactName = ref("");
const phone = ref("");
const address = ref("");
const notes = ref("");

const selectedZone = computed(
  () => deliveryZones.value?.find((zone) => zone.id === selectedZoneId.value) ?? null,
);
const deliveryFeeCents = computed(() =>
  fulfillment.value === "delivery" ? selectedZone.value?.fee_cents ?? 0 : 0,
);
const totalCents = computed(() => subtotalCents.value + deliveryFeeCents.value);
const requiresZone = computed(
  () => fulfillment.value === "delivery" && (deliveryZones.value?.length ?? 0) > 0,
);
const isCheckoutReady = computed(
  () =>
    items.value.length > 0 &&
    contactName.value.trim().length > 1 &&
    phone.value.trim().length > 5 &&
    (fulfillment.value === "pickup" ||
      (Boolean(selectedZone.value) && address.value.trim().length > 4)),
);

watch(fulfillment, () => {
  checkoutMessage.value = "";
});

const preparePayment = () => {
  if (!isCheckoutReady.value) {
    checkoutMessage.value = "Completa tus datos y la forma de recibir el pedido para continuar.";
    return;
  }

  checkoutMessage.value =
    "Tu pedido está listo para pagar. La conexión con Wompi se habilitará aquí próximamente; todavía no se ha creado ningún cobro.";
};
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
    <div class="max-w-2xl">
      <p class="font-mono text-xs uppercase tracking-[0.22em] text-cocoa">Tu pedido</p>
      <h1 class="mt-2 font-display text-4xl font-semibold text-espresso sm:text-5xl">Carrito</h1>
      <p class="mt-3 text-espresso/65">
        Revisa las capas de tu tiramisú y elige cómo quieres recibirlo.
      </p>
    </div>

    <section v-if="hasHydrated && items.length === 0" class="mt-10 rounded-3xl border border-dashed border-espresso/20 bg-white/45 px-6 py-16 text-center sm:px-12">
      <p class="font-display text-3xl text-espresso">Tu carrito está esperando algo dulce.</p>
      <p class="mt-3 text-sm text-espresso/60">Elige tus sabores favoritos y aparecerán aquí.</p>
      <NuxtLink to="/productos" class="mt-7 inline-flex rounded-full bg-espresso px-6 py-3 text-sm font-semibold text-mascarpone transition-colors hover:bg-cocoa">
        Ver sabores
      </NuxtLink>
    </section>

    <div v-else-if="hasHydrated" class="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div class="space-y-8">
        <section aria-labelledby="items-title">
          <div class="flex items-baseline justify-between gap-4">
            <h2 id="items-title" class="font-display text-2xl font-semibold text-espresso">Tus sabores</h2>
            <span class="font-mono text-xs uppercase tracking-wider text-espresso/45">{{ items.length }} referencias</span>
          </div>

          <ul class="mt-4 divide-y divide-espresso/10 border-y border-espresso/10 bg-white/35">
            <li v-for="item in items" :key="item.id" class="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:gap-5">
              <NuxtLink :to="`/productos/${item.slug}`" class="aspect-square overflow-hidden rounded-2xl bg-linear-to-br from-mascarpone to-espresso/10">
                <img v-if="item.image_url" :src="item.image_url" :alt="item.name" class="h-full w-full object-cover" />
                <span v-else class="flex h-full items-center justify-center font-display text-3xl text-espresso/25">{{ item.name.charAt(0) }}</span>
              </NuxtLink>

              <div class="min-w-0">
                <NuxtLink :to="`/productos/${item.slug}`" class="font-display text-xl font-semibold text-espresso hover:text-cocoa">
                  {{ item.name }}
                </NuxtLink>
                <p class="mt-1 font-mono text-xs text-espresso/55">{{ formatCOP(item.price_cents) }} por unidad</p>
                <div class="mt-4 flex items-center gap-3">
                  <div class="inline-flex items-center rounded-full border border-espresso/15 bg-white" aria-label="Cantidad">
                    <button type="button" class="grid h-8 w-8 place-items-center text-lg leading-none text-espresso/70 hover:text-espresso" :aria-label="`Quitar una unidad de ${item.name}`" @click="updateQuantity(item.id, item.quantity - 1)">−</button>
                    <span class="grid h-8 min-w-8 place-items-center font-mono text-xs text-espresso">{{ item.quantity }}</span>
                    <button type="button" class="grid h-8 w-8 place-items-center text-lg leading-none text-espresso/70 hover:text-espresso" :aria-label="`Añadir una unidad de ${item.name}`" @click="updateQuantity(item.id, item.quantity + 1)">+</button>
                  </div>
                  <button type="button" class="text-xs font-semibold text-cocoa underline-offset-4 hover:underline" @click="removeItem(item.id)">Quitar</button>
                </div>
              </div>

              <p class="col-start-2 font-mono text-sm font-medium text-espresso sm:col-start-auto sm:pt-1">{{ formatCOP(item.price_cents * item.quantity) }}</p>
            </li>
          </ul>
        </section>

        <form class="space-y-8" @submit.prevent="preparePayment">
          <section aria-labelledby="delivery-title">
            <div class="flex items-baseline justify-between gap-4">
              <h2 id="delivery-title" class="font-display text-2xl font-semibold text-espresso">Cómo lo recibes</h2>
              <span class="font-mono text-[10px] uppercase tracking-widest text-espresso/45">Paso 1 de 2</span>
            </div>

            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <label class="relative flex cursor-pointer gap-3 rounded-2xl border bg-white/60 p-4 transition-colors" :class="fulfillment === 'pickup' ? 'border-cocoa bg-white ring-1 ring-cocoa/25' : 'border-espresso/15 hover:border-espresso/30'">
                <input v-model="fulfillment" value="pickup" type="radio" name="fulfillment" class="sr-only" />
                <span class="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-botanical text-sm text-mascarpone">↗</span>
                <span>
                  <span class="block font-semibold text-espresso">Recoger</span>
                  <span class="mt-1 block text-sm text-espresso/60">Sin costo adicional.</span>
                  <span v-if="config.public.pickupAddress" class="mt-2 block text-xs text-espresso/55">{{ config.public.pickupAddress }}</span>
                  <span v-if="config.public.pickupHours" class="mt-1 block text-xs text-espresso/55">{{ config.public.pickupHours }}</span>
                </span>
              </label>

              <label class="relative flex cursor-pointer gap-3 rounded-2xl border bg-white/60 p-4 transition-colors" :class="fulfillment === 'delivery' ? 'border-cocoa bg-white ring-1 ring-cocoa/25' : 'border-espresso/15 hover:border-espresso/30'">
                <input v-model="fulfillment" value="delivery" type="radio" name="fulfillment" class="sr-only" />
                <span class="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-saffron text-sm text-espresso">⌂</span>
                <span>
                  <span class="block font-semibold text-espresso">Envío a domicilio</span>
                  <span class="mt-1 block text-sm text-espresso/60">La tarifa depende de tu zona.</span>
                </span>
              </label>
            </div>

            <div v-if="fulfillment === 'delivery'" class="mt-4 rounded-2xl border border-espresso/10 bg-white/45 p-4 sm:p-5">
              <label for="delivery-zone" class="block text-sm font-semibold text-espresso">Zona de entrega</label>
              <p class="mt-1 text-xs text-espresso/60">Solo mostramos zonas disponibles actualmente.</p>
              <select id="delivery-zone" v-model="selectedZoneId" :disabled="deliveryZonesPending || Boolean(deliveryZonesError)" class="mt-3 w-full rounded-xl border border-espresso/15 bg-white px-3 py-3 text-sm text-espresso outline-none transition focus:border-cocoa focus:ring-2 focus:ring-cocoa/20 disabled:cursor-not-allowed disabled:opacity-60">
                <option :value="null">{{ deliveryZonesPending ? 'Cargando zonas…' : 'Selecciona tu zona' }}</option>
                <option v-for="zone in deliveryZones" :key="zone.id" :value="zone.id">{{ zone.name }} · {{ formatCOP(zone.fee_cents) }}</option>
              </select>
              <p v-if="deliveryZonesError" class="mt-3 text-sm text-red-800">No pudimos consultar las zonas de entrega. Puedes elegir recoger tu pedido.</p>
              <p v-else-if="!deliveryZonesPending && !requiresZone" class="mt-3 text-sm text-espresso/65">Por ahora no hay zonas de envío disponibles. Puedes recoger sin costo.</p>

              <label for="address" class="mt-5 block text-sm font-semibold text-espresso">Dirección de entrega</label>
              <textarea id="address" v-model="address" rows="2" :required="fulfillment === 'delivery'" placeholder="Barrio, dirección y referencias" class="mt-2 w-full resize-y rounded-xl border border-espresso/15 bg-white px-3 py-3 text-sm text-espresso outline-none transition placeholder:text-espresso/35 focus:border-cocoa focus:ring-2 focus:ring-cocoa/20" />
            </div>
          </section>

          <section aria-labelledby="contact-title">
            <div class="flex items-baseline justify-between gap-4">
              <h2 id="contact-title" class="font-display text-2xl font-semibold text-espresso">Datos de contacto</h2>
              <span class="font-mono text-[10px] uppercase tracking-widest text-espresso/45">Paso 2 de 2</span>
            </div>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <label class="block text-sm font-semibold text-espresso">Nombre
                <input v-model="contactName" required autocomplete="name" placeholder="Tu nombre" class="mt-2 w-full rounded-xl border border-espresso/15 bg-white/70 px-3 py-3 text-sm font-normal outline-none transition placeholder:text-espresso/35 focus:border-cocoa focus:ring-2 focus:ring-cocoa/20" />
              </label>
              <label class="block text-sm font-semibold text-espresso">Celular
                <input v-model="phone" required autocomplete="tel" inputmode="tel" placeholder="300 000 0000" class="mt-2 w-full rounded-xl border border-espresso/15 bg-white/70 px-3 py-3 text-sm font-normal outline-none transition placeholder:text-espresso/35 focus:border-cocoa focus:ring-2 focus:ring-cocoa/20" />
              </label>
            </div>
            <label class="mt-4 block text-sm font-semibold text-espresso">Notas para tu pedido <span class="font-normal text-espresso/45">(opcional)</span>
              <textarea v-model="notes" rows="2" placeholder="Por ejemplo, hora ideal para recoger" class="mt-2 w-full resize-y rounded-xl border border-espresso/15 bg-white/70 px-3 py-3 text-sm font-normal outline-none transition placeholder:text-espresso/35 focus:border-cocoa focus:ring-2 focus:ring-cocoa/20" />
            </label>
          </section>

          <button type="submit" class="w-full rounded-full bg-espresso px-6 py-4 text-sm font-semibold text-mascarpone transition-colors hover:bg-cocoa focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cocoa disabled:cursor-not-allowed disabled:bg-espresso/40" :disabled="items.length === 0">
            Continuar al pago
          </button>
          <p v-if="checkoutMessage" class="rounded-2xl bg-saffron/20 px-4 py-3 text-sm leading-relaxed text-espresso" aria-live="polite">{{ checkoutMessage }}</p>
        </form>
      </div>

      <aside class="sticky top-24 overflow-hidden rounded-3xl border border-espresso/10 bg-espresso text-mascarpone shadow-xl shadow-espresso/10">
        <div class="p-6">
          <p class="font-mono text-[10px] uppercase tracking-[0.22em] text-saffron">Resumen</p>
          <h2 class="mt-2 font-display text-2xl font-semibold">El total de tu antojo</h2>
          <div class="mt-7 space-y-3 text-sm">
            <div class="flex justify-between gap-4 text-mascarpone/75"><span>Productos</span><span>{{ formatCOP(subtotalCents) }}</span></div>
            <div class="flex justify-between gap-4 text-mascarpone/75"><span>{{ fulfillment === 'pickup' ? 'Recogida' : 'Envío' }}</span><span>{{ fulfillment === 'pickup' ? 'Sin costo' : selectedZone ? formatCOP(deliveryFeeCents) : 'Por definir' }}</span></div>
          </div>
          <div class="mt-5 border-t border-mascarpone/20 pt-5">
            <div class="flex items-end justify-between gap-4"><span class="font-semibold">Total</span><span class="font-mono text-2xl font-semibold text-saffron">{{ formatCOP(totalCents) }}</span></div>
          </div>
        </div>
        <div class="strata-divider" />
        <p class="px-6 py-4 text-xs leading-relaxed text-mascarpone/65">El pago seguro con Wompi se conectará en el siguiente paso.</p>
      </aside>
    </div>

    <div v-else class="mt-10 grid gap-4" aria-live="polite">
      <div class="h-28 animate-pulse rounded-3xl bg-espresso/8" />
      <div class="h-64 animate-pulse rounded-3xl bg-espresso/8" />
    </div>
  </main>
</template>
