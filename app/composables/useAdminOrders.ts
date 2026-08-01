import type { Tables } from "@/../database.types.ts";

export type AdminOrderItem = Tables<"order_items">;
export type AdminOrder = Tables<"orders"> & {
  order_items: AdminOrderItem[];
};

export type OrderPatch = Partial<
  Pick<Tables<"orders">, "order_status" | "total_cents" | "delivery_fee_cents">
>;

export type ItemPatchInput = {
  product_id: string;
  product_name: string;
  unit_price_cents: number;
  quantity: number;
};

export function useAdminOrders() {
  const list = () => $fetch<AdminOrder[]>("/api/admin/orders");

  const updateOrder = (id: string, patch: OrderPatch) =>
    $fetch<AdminOrder>(`/api/admin/orders/${id}`, {
      method: "PATCH",
      body: patch,
    });

  const updateItems = (id: string, items: ItemPatchInput[]) =>
    $fetch<AdminOrder>(`/api/admin/orders/${id}/items`, {
      method: "PATCH",
      body: { items },
    });

  const remove = (id: string) =>
    $fetch(`/api/admin/orders/${id}`, { method: "DELETE" });

  return { list, updateOrder, updateItems, remove };
}
