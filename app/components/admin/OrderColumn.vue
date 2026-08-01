<script setup lang="ts">
import type { AdminOrder } from '~/composables/useAdminOrders';
import type { OrderStatus } from '~/utils/orderStatus';
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from '~/utils/orderStatus';
import OrderCard from './OrderCard.vue';

const props = defineProps<{ status: OrderStatus; orders: AdminOrder[] }>();
const emit = defineEmits<{ select: [order: AdminOrder]; advance: [order: AdminOrder] }>();

const style = computed(() => ORDER_STATUS_STYLES[props.status]);
</script>

<template>
    <div class="flex w-80 shrink-0 flex-col rounded-2xl border border-espresso/10 bg-white">
        <div :class="['flex items-center justify-between rounded-t-2xl border-b px-4 py-3', style.bg, style.border]">
            <span :class="['font-mono text-xs font-semibold uppercase tracking-widest', style.text]">
                {{ ORDER_STATUS_LABELS[status] }}
            </span>
            <span
                :class="['flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold', style.bg, style.text]">
                {{ orders.length }}
            </span>
        </div>
        <div class="flex flex-1 flex-col gap-3 p-3">
            <p v-if="orders.length === 0" class="py-6 text-center text-xs text-espresso/40">Sin pedidos</p>
            <OrderCard v-for="order in orders" :key="order.id" :order="order" @click="emit('select', order)"
                @advance="emit('advance', order)" />
        </div>
    </div>
</template>
