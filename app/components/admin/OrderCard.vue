<script setup lang="ts">
import type { AdminOrder } from '~/composables/useAdminOrders';
import { formatCOP } from '~/utils/currency';
import { nextOrderStatus, ORDER_STATUS_LABELS } from '~/utils/orderStatus';

const props = defineProps<{ order: AdminOrder }>();
defineEmits<{ click: []; advance: [] }>();

const next = computed(() => nextOrderStatus(props.order.order_status));

const itemsSummary = computed(() =>
    props.order.order_items.map((item) => `${item.quantity}x ${item.product_name}`).join(', '),
);

const createdAt = computed(() =>
    new Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(props.order.created_at)),
);
</script>

<template>
    <article
        class="cursor-pointer rounded-xl border border-espresso/10 bg-mascarpone/60 p-3 transition-shadow hover:shadow-md"
        @click="$emit('click')">
        <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-espresso">{{ order.name }}</p>
                <p class="text-xs text-espresso/50">{{ order.phone }}</p>
            </div>
            <span
                class="shrink-0 rounded-full bg-espresso/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-espresso/60">
                {{ order.fulfillment_type === 'delivery' ? 'Domicilio' : 'Recogida' }}
            </span>
        </div>

        <p class="mt-2 line-clamp-2 text-xs text-espresso/70">{{ itemsSummary }}</p>

        <div class="mt-3 flex items-center justify-between">
            <span class="font-mono text-sm font-semibold text-espresso">{{ formatCOP(order.total_cents) }}</span>
            <span class="text-[11px] text-espresso/40">{{ createdAt }}</span>
        </div>

        <button v-if="next" type="button"
            class="mt-3 w-full rounded-full bg-espresso/5 px-3 py-1.5 text-xs font-semibold text-espresso transition-colors hover:bg-espresso hover:text-mascarpone"
            @click.stop="$emit('advance')">
            Marcar como {{ ORDER_STATUS_LABELS[next] }}
        </button>
    </article>
</template>
