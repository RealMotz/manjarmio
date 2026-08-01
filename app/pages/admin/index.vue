<script setup lang="ts">
import type { AdminOrder } from '~/composables/useAdminOrders';
import { useAdminOrders } from '~/composables/useAdminOrders';
import { nextOrderStatus } from '~/utils/orderStatus';
import OrderBoard from '~/components/admin/OrderBoard.vue';
import OrderEditModal from '~/components/admin/OrderEditModal.vue';

definePageMeta({ layout: 'admin', middleware: 'admin' });

const { list, updateOrder } = useAdminOrders();

const orders = ref<AdminOrder[]>([]);
const loading = ref(true);
const loadError = ref('');
const selectedOrder = ref<AdminOrder | null>(null);

const refresh = async () => {
    try {
        orders.value = await list();
        loadError.value = '';
    } catch {
        loadError.value = 'No se pudieron cargar los pedidos';
    } finally {
        loading.value = false;
    }
};

const applyUpdatedOrder = (updated: AdminOrder) => {
    const index = orders.value.findIndex((order) => order.id === updated.id);
    if (index !== -1) orders.value[index] = updated;
};

const onAdvance = async (order: AdminOrder) => {
    const next = nextOrderStatus(order.order_status);
    if (!next) return;
    const updated = await updateOrder(order.id, { order_status: next });
    applyUpdatedOrder(updated);
};

const onSaved = (updated: AdminOrder) => {
    applyUpdatedOrder(updated);
    selectedOrder.value = null;
};

const onDeleted = (id: string) => {
    orders.value = orders.value.filter((order) => order.id !== id);
    selectedOrder.value = null;
};

let pollTimer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
    refresh();
    pollTimer = setInterval(() => {
        if (!selectedOrder.value) refresh();
    }, 30000);
});

onUnmounted(() => {
    if (pollTimer) clearInterval(pollTimer);
});
</script>

<template>
    <div class="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
        <div class="mb-6 flex items-center justify-between">
            <h1 class="font-display text-2xl text-espresso">Pedidos</h1>
            <button type="button" class="text-xs font-semibold text-espresso/50 hover:text-espresso"
                @click="refresh">
                Actualizar
            </button>
        </div>

        <p v-if="loading" class="text-sm text-espresso/50">Cargando pedidos...</p>
        <p v-else-if="loadError" class="text-sm text-cocoa">{{ loadError }}</p>
        <OrderBoard v-else :orders="orders" @select="selectedOrder = $event" @advance="onAdvance" />

        <OrderEditModal v-if="selectedOrder" :order="selectedOrder" @close="selectedOrder = null" @saved="onSaved"
            @deleted="onDeleted" />
    </div>
</template>
