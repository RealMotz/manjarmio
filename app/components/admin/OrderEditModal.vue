<script setup lang="ts">
import type { AdminOrder, ItemPatchInput } from '~/composables/useAdminOrders';
import { useAdminOrders } from '~/composables/useAdminOrders';
import { useProducts, type Product } from '~/composables/useProducts';
import { formatCOP } from '~/utils/currency';
import {
    ORDER_STATUS_COLUMNS,
    ORDER_STATUS_LABELS,
} from '~/utils/orderStatus';

const props = defineProps<{ order: AdminOrder }>();
const emit = defineEmits<{ close: []; saved: [order: AdminOrder]; deleted: [id: string] }>();

const { updateOrder, updateItems, remove } = useAdminOrders();

const orderStatus = ref(props.order.order_status);
const domicilio = ref<number>(Math.round(props.order.delivery_fee_cents / 100));
const domicilioTotal = computed<number>({
    get: () => domicilio.value,
    set: (val: number | string) => {
        domicilio.value = typeof val === 'string' && val === '' ? 0 : Number(val);
    }
});
const totalPesos = ref(Math.round(props.order.total_cents / 100) + domicilioTotal.value);

type ItemRow = ItemPatchInput & { key: number };
let rowKey = 0;
const items = ref<ItemRow[]>(
    props.order.order_items.map((item) => ({
        key: rowKey++,
        product_id: item.product_id,
        product_name: item.product_name,
        unit_price_cents: item.unit_price_cents,
        quantity: item.quantity,
    })),
);

const originalItemsKey = JSON.stringify(
    props.order.order_items
        .map((item) => ({
            product_id: item.product_id,
            product_name: item.product_name,
            unit_price_cents: item.unit_price_cents,
            quantity: item.quantity,
        }))
        .sort((a, b) => a.product_id.localeCompare(b.product_id)),
);

const itemsChanged = computed(() => {
    const current = items.value
        .map(({ product_id, product_name, unit_price_cents, quantity }) => ({
            product_id,
            product_name,
            unit_price_cents,
            quantity,
        }))
        .sort((a, b) => a.product_id.localeCompare(b.product_id));
    return JSON.stringify(current) !== originalItemsKey;
});

const subtotalCents = computed(() =>
    items.value.reduce((sum, item) => sum + item.unit_price_cents * item.quantity, 0)
);

watch(subtotalCents, (subtotal) => {
    totalPesos.value = Math.round((subtotal) / 100)
});

watch(domicilio, () => {
    totalPesos.value = Math.round((subtotalCents.value) / 100) + domicilioTotal.value;
})

const products = ref<Product[]>([]);
const loadingRefs = ref(true);

onMounted(async () => {
    try {
        const productsResult = await useProducts().getAll()
        products.value = productsResult;
    } finally {
        loadingRefs.value = false;
    }
});

const addItemRow = () => {
    const first = products.value[0];
    items.value.push({
        key: rowKey++,
        product_id: first?.id ?? '',
        product_name: first?.name ?? '',
        unit_price_cents: first ? Number(first.price_cents) : 0,
        quantity: 1,
    });
};

const removeItemRow = (key: number) => {
    items.value = items.value.filter((item) => item.key !== key);
};

const setRowProduct = (row: ItemRow, productId: string) => {
    const product = products.value.find((p) => p.id === productId);
    if (!product) return;
    row.product_id = product.id;
    row.product_name = product.name;
    row.unit_price_cents = Number(product.price_cents);
};

const saving = ref(false);
const deleting = ref(false);
const error = ref('');

const save = async () => {
    if (items.value.length === 0) {
        error.value = 'El pedido debe tener al menos un producto';
        return;
    }

    error.value = '';
    saving.value = true;
    try {
        if (itemsChanged.value) {
            await updateItems(
                props.order.id,
                items.value.map(({ product_id, product_name, unit_price_cents, quantity }) => ({
                    product_id,
                    product_name,
                    unit_price_cents,
                    quantity,
                })),
            );
        }

        const updated = await updateOrder(props.order.id, {
            order_status: orderStatus.value,
            total_cents: Math.round(totalPesos.value * 100),
            delivery_fee_cents: Math.round(domicilioTotal.value * 100)
        });

        emit('saved', updated);
    } catch {
        error.value = 'No se pudo guardar el pedido';
    } finally {
        saving.value = false;
    }
};

const confirmingDelete = ref(false);

const doDelete = async () => {
    deleting.value = true;
    try {
        await remove(props.order.id);
        emit('deleted', props.order.id);
    } catch {
        error.value = 'No se pudo eliminar el pedido';
        deleting.value = false;
    }
};
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-espresso/40 p-4" @click.self="emit('close')">
        <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div class="flex items-start justify-between">
                <div>
                    <h2 class="font-display text-xl text-espresso">{{ order.name }}</h2>
                    <p class="text-xs text-espresso/50">{{ order.phone }} · {{ order.email }}</p>
                </div>
                <button type="button" class="text-espresso/40 hover:text-espresso" @click="emit('close')">
                    ✕
                </button>
            </div>

            <div class="mt-5 grid grid-cols-2 gap-4">
                <div>
                    <label class="font-mono text-[11px] uppercase tracking-widest text-espresso/50">Estado</label>
                    <select v-model="orderStatus"
                        class="mt-1 w-full rounded-lg border border-espresso/20 bg-white px-3 py-2 text-sm text-espresso">
                        <option v-for="status in ORDER_STATUS_COLUMNS" :key="status" :value="status">
                            {{ ORDER_STATUS_LABELS[status] }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="mt-5">
                <div class="flex items-center justify-between">
                    <label class="font-mono text-[11px] uppercase tracking-widest text-espresso/50">Productos</label>
                    <button type="button" class="text-xs font-semibold text-cocoa hover:underline"
                        :disabled="loadingRefs" @click="addItemRow">
                        + Agregar producto
                    </button>
                </div>

                <div class="mt-2 space-y-2">
                    <div v-for="row in items" :key="row.key" class="flex items-center gap-2">
                        <select :value="row.product_id"
                            class="min-w-0 flex-1 rounded-lg border border-espresso/20 bg-white px-2 py-1.5 text-sm text-espresso"
                            @change="setRowProduct(row, ($event.target as HTMLSelectElement).value)">
                            <option v-for="product in products" :key="product.id" :value="product.id">
                                {{ product.name }}
                            </option>
                        </select>
                        <input v-model.number="row.quantity" type="number" min="1"
                            class="w-16 rounded-lg border border-espresso/20 px-2 py-1.5 text-sm text-espresso" />
                        <span class="w-24 shrink-0 text-right font-mono text-xs text-espresso/60">
                            {{ formatCOP(row.unit_price_cents * row.quantity) }}
                        </span>
                        <button type="button" class="shrink-0 text-espresso/30 hover:text-cocoa"
                            @click="removeItemRow(row.key)">
                            ✕
                        </button>
                    </div>
                </div>
            </div>

            <div class="mt-5">
                <label class="font-mono text-[11px] uppercase tracking-widest text-espresso/50">
                    Total (COP)
                </label>
                <input v-model.number="totalPesos" type="number" min="0"
                    class="mt-1 w-full rounded-lg border border-espresso/20 px-3 py-2 text-sm text-espresso" />
                <p class="mt-1 text-[11px] text-espresso/40">
                    Se recalcula automáticamente al cambiar los productos; puedes ajustarlo manualmente.
                </p>
            </div>

            <div class="mt-5" v-if="order.fulfillment_type === 'delivery'">
                <label class="font-mono text-[11px] uppercase tracking-widest text-espresso/50">
                    Domicilio
                </label>
                <input v-model.number="domicilioTotal" type="number" min="0"
                    class="mt-1 w-full rounded-lg border border-espresso/20 px-3 py-2 text-sm text-espresso" />
            </div>

            <p v-if="error" class="mt-4 text-sm text-cocoa">{{ error }}</p>

            <div class="mt-6 flex items-center justify-between gap-3">
                <template v-if="confirmingDelete">
                    <span class="text-xs text-espresso/60">¿Eliminar este pedido?</span>
                    <div class="flex gap-2">
                        <button type="button" class="text-xs text-espresso/50 hover:text-espresso"
                            @click="confirmingDelete = false">
                            Cancelar
                        </button>
                        <button type="button" :disabled="deleting"
                            class="rounded-full bg-cocoa px-3 py-1.5 text-xs font-semibold text-mascarpone disabled:opacity-50"
                            @click="doDelete">
                            {{ deleting ? 'Eliminando...' : 'Confirmar' }}
                        </button>
                    </div>
                </template>
                <button v-else type="button" class="text-xs font-semibold text-cocoa hover:underline"
                    @click="confirmingDelete = true">
                    Eliminar pedido
                </button>

                <button type="button" :disabled="saving"
                    class="rounded-full bg-espresso px-5 py-2 text-sm font-semibold text-mascarpone transition-colors hover:bg-cocoa disabled:opacity-50"
                    @click="save">
                    {{ saving ? 'Guardando...' : 'Guardar cambios' }}
                </button>
            </div>
        </div>
    </div>
</template>
