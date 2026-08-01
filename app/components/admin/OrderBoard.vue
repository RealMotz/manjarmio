<script setup lang="ts">
import type { AdminOrder } from '~/composables/useAdminOrders';
import type { OrderStatus } from '~/utils/orderStatus';
import { ORDER_STATUS_COLUMNS } from '~/utils/orderStatus';
import OrderColumn from './OrderColumn.vue';

const props = defineProps<{ orders: AdminOrder[] }>();
const emit = defineEmits<{ select: [order: AdminOrder]; advance: [order: AdminOrder] }>();

const ordersByStatus = computed(() => {
    const grouped = Object.fromEntries(
        ORDER_STATUS_COLUMNS.map((status) => [status, [] as AdminOrder[]]),
    ) as Record<OrderStatus, AdminOrder[]>;

    for (const order of props.orders) {
        grouped[order.order_status]?.push(order);
    }

    return grouped;
});
</script>

<template>
    <div class="flex gap-4 overflow-x-auto pb-4">
        <OrderColumn v-for="status in ORDER_STATUS_COLUMNS" :key="status" :status="status"
            :orders="ordersByStatus[status]" @select="emit('select', $event)" @advance="emit('advance', $event)" />
    </div>
</template>
