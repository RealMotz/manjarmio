<script setup lang="ts">
import { formatCOP } from "~/utils/currency";
import { buildWhatsappLink, buildWhatsappOrderMessage, openWhatsapp, type WhatsappFulfillmentDetails } from "~/utils/whatsapp";

const config = useRuntimeConfig();
const { items, subtotalCents, clearCart } = useCart();

const {
  pickup,
  fulfillment,
  contactName,
  phone,
  email,
  address,
  notes,
  deliveryDate,
  deliveryTime,
  selectedZone,
  deliveryFeeCents,
  totalCents,
  isCheckoutReady,
  deliveryDateOptions,
  deliveryTimeOptions,
  workingHoursStartLabel,
  workingHoursEndLabel,
  resetCheckout,
} = await useCheckoutSummary();

if (items.value.length === 0 || !isCheckoutReady.value) {
  await navigateTo("/carrito");
}

const fulfillmentDetails = computed<WhatsappFulfillmentDetails>(() =>
  fulfillment.value === "pickup"
    ? {
        type: "pickup",
        address: config.public.pickupAddress ?? null,
        address2: config.public.pickupAddress2 ?? null,
        hours: config.public.pickupHours ?? null,
      }
    : {
        type: "delivery",
        zoneName: selectedZone.value?.name ?? "",
        address: address.value,
        dateLabel: deliveryDateOptions.value.find((option) => option.value === deliveryDate.value)?.label ?? deliveryDate.value,
        timeLabel: deliveryTimeOptions.value.find((option) => option.value === deliveryTime.value)?.label ?? deliveryTime.value,
      },
);

const orderApi = useOrders();
const submitting = ref(false);
const confirmMessage = ref("");
const orderConfirmed = ref(false);
const whatsappUrl = ref("");

const confirmOrder = async () => {
  if (items.value.length === 0 || !isCheckoutReady.value) {
    confirmMessage.value = "Tu pedido ya no está disponible, vuelve al carrito.";
    return;
  }

  if (!config.public.whatsappBusinessNumber) {
    confirmMessage.value = "No pudimos abrir WhatsApp, contáctanos directamente.";
    return;
  }

  submitting.value = true;

  const order: CartOrder = {
    address: address.value,
    delivery_fee_cents: deliveryFeeCents.value,
    delivery_notes: notes.value,
    email: email.value,
    fulfillment_type: fulfillment.value,
    name: contactName.value,
    order_status: "new",
    payment_status: "pending",
    phone: phone.value,
    total_cents: totalCents.value,
    zone_id: fulfillment.value === "delivery" ? selectedZone.value?.id : pickup?.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  let createdOrder;
  try {
    createdOrder = await orderApi.createOrder(order);
  } catch (err) {
    submitting.value = false;
    confirmMessage.value =
      err instanceof Error ? err.message : "No pudimos registrar tu pedido. Intenta de nuevo.";
    return;
  }

  const message = buildWhatsappOrderMessage({
    orderId: createdOrder.id,
    items: items.value.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unitPriceCents: item.price_cents,
      lineTotalCents: item.price_cents * item.quantity,
    })),
    fulfillment: fulfillmentDetails.value,
    subtotalCents: subtotalCents.value,
    deliveryFeeCents: deliveryFeeCents.value,
    totalCents: totalCents.value,
    contactName: contactName.value,
    phone: phone.value,
    email: email.value,
    notes: notes.value || undefined,
  });

  whatsappUrl.value = buildWhatsappLink(config.public.whatsappBusinessNumber, message);
  openWhatsapp(whatsappUrl.value);

  clearCart();
  resetCheckout();
  orderConfirmed.value = true;
  submitting.value = false;
  confirmMessage.value = "Tu pedido fue creado. Continúa la confirmación del pago en WhatsApp.";
};
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
    <div class="max-w-2xl">
      <p class="font-mono text-xs uppercase tracking-[0.22em] text-cocoa">Último paso</p>
      <h1 class="mt-2 font-display text-4xl font-semibold text-espresso sm:text-5xl">Confirma tu pedido</h1>
      <p class="mt-3 text-espresso/65">
        Revisa que todo esté correcto antes de continuar. Vamos a crear tu pedido y coordinar el pago por WhatsApp.
      </p>
    </div>

    <div v-if="!orderConfirmed" class="mt-10 space-y-8">
      <section aria-labelledby="summary-items-title"
        class="rounded-3xl border border-espresso/10 bg-white/45 p-6 sm:p-7">
        <h2 id="summary-items-title" class="font-display text-xl font-semibold text-espresso">Tus sabores</h2>
        <ul class="mt-4 divide-y divide-espresso/10">
          <li v-for="item in items" :key="item.id" class="flex items-center justify-between gap-4 py-3">
            <div>
              <p class="font-semibold text-espresso">{{ item.quantity }}x {{ item.name }}</p>
              <p class="font-mono text-xs text-espresso/55">{{ formatCOP(item.price_cents) }} por unidad</p>
            </div>
            <p class="font-mono text-sm font-medium text-espresso">{{ formatCOP(item.price_cents * item.quantity) }}</p>
          </li>
        </ul>
      </section>

      <section aria-labelledby="summary-delivery-title"
        class="rounded-3xl border border-espresso/10 bg-white/45 p-6 sm:p-7">
        <h2 id="summary-delivery-title" class="font-display text-xl font-semibold text-espresso">Cómo lo recibes</h2>
        <div v-if="fulfillmentDetails.type === 'pickup'" class="mt-3 space-y-1 text-sm text-espresso/70">
          <p class="font-semibold text-espresso">Recoger en tienda</p>
          <p v-if="fulfillmentDetails.address">{{ fulfillmentDetails.address }}</p>
          <p v-if="fulfillmentDetails.address2">{{ fulfillmentDetails.address2 }}</p>
          <p v-if="fulfillmentDetails.hours">{{ fulfillmentDetails.hours }}</p>
        </div>
        <div v-else class="mt-3 space-y-1 text-sm text-espresso/70">
          <p class="font-semibold text-espresso">Envío a domicilio · {{ fulfillmentDetails.zoneName }}</p>
          <p>{{ fulfillmentDetails.address }}</p>
          <p><span class="capitalize">{{ fulfillmentDetails.dateLabel }}</span> · {{ fulfillmentDetails.timeLabel }}</p>
        </div>
      </section>

      <section aria-labelledby="summary-contact-title"
        class="rounded-3xl border border-espresso/10 bg-white/45 p-6 sm:p-7">
        <h2 id="summary-contact-title" class="font-display text-xl font-semibold text-espresso">Datos de contacto</h2>
        <div class="mt-3 space-y-1 text-sm text-espresso/70">
          <p class="font-semibold text-espresso">{{ contactName }}</p>
          <p>{{ phone }}</p>
          <p>{{ email }}</p>
          <p v-if="notes">Notas: {{ notes }}</p>
        </div>
      </section>

      <section aria-labelledby="summary-total-title"
        class="rounded-3xl border border-espresso/10 bg-espresso p-6 text-mascarpone sm:p-7">
        <h2 id="summary-total-title" class="font-mono text-[10px] uppercase tracking-[0.22em] text-saffron">Resumen</h2>
        <div class="mt-4 space-y-2 text-sm text-mascarpone/75">
          <div class="flex justify-between gap-4"><span>Productos</span><span>{{ formatCOP(subtotalCents) }}</span></div>
          <div class="flex justify-between gap-4">
            <span>{{ fulfillment === 'pickup' ? 'Recogida' : 'Envío' }}</span>
            <span>{{ fulfillment === 'pickup' ? 'Sin costo' : formatCOP(deliveryFeeCents) }}</span>
          </div>
        </div>
        <div class="mt-4 flex items-end justify-between gap-4 border-t border-mascarpone/20 pt-4">
          <span class="font-semibold">Total</span>
          <span class="font-mono text-2xl font-semibold text-saffron">{{ formatCOP(totalCents) }}</span>
        </div>
      </section>

      <section
        class="rounded-2xl border border-saffron/40 bg-saffron/15 px-5 py-4 text-sm leading-relaxed text-espresso">
        <p>
          Al confirmar, vamos a crear tu pedido y abrir WhatsApp para que coordines el pago directamente con
          Manjarmío. El pago no se procesa en este sitio.
        </p>
        <p class="mt-2 font-semibold">
          Si no confirmamos el pago por WhatsApp entre las {{ workingHoursStartLabel }} y las
          {{ workingHoursEndLabel }}, tu entrega podría retrasarse o cancelarse.
        </p>
      </section>

      <div class="space-y-4">
        <button type="button"
          class="w-full rounded-full bg-espresso px-6 py-4 text-sm font-semibold text-mascarpone transition-colors hover:bg-cocoa focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cocoa disabled:cursor-not-allowed disabled:bg-espresso/40"
          :disabled="submitting" @click="confirmOrder">
          {{ submitting ? "Creando tu pedido…" : "Confirmar y continuar en WhatsApp" }}
        </button>
        <NuxtLink to="/carrito"
          class="block text-center text-sm font-semibold text-cocoa underline-offset-4 hover:underline">
          Volver al carrito
        </NuxtLink>
        <p v-if="confirmMessage" class="rounded-2xl bg-saffron/20 px-4 py-3 text-sm leading-relaxed text-espresso"
          aria-live="polite">{{ confirmMessage }}</p>
      </div>
    </div>

    <div v-else class="mt-10 space-y-4 rounded-3xl border border-botanical/30 bg-botanical/10 px-6 py-6 text-center">
      <p class="font-display text-2xl text-espresso">¡Listo! Tu pedido fue creado.</p>
      <p class="text-sm text-espresso/70">{{ confirmMessage }}</p>
      <button type="button" @click="openWhatsapp(whatsappUrl)"
        class="inline-flex rounded-full bg-espresso px-6 py-3 text-sm font-semibold text-mascarpone transition-colors hover:bg-cocoa">
        Abrir WhatsApp de nuevo
      </button>
      <NuxtLink to="/catalogo"
        class="block text-sm font-semibold text-cocoa underline-offset-4 hover:underline">
        Volver al catálogo
      </NuxtLink>
    </div>
  </main>
</template>
