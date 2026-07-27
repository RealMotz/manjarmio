import type { Tables, Enums } from "@/../database.types.ts";

export type Orders = Tables<"orders">;
export type FullfilmentType = Enums<"fulfillment_type">;
export type OrderStatus = Enums<"order_status">;
export type PaymentStatus = Enums<"payment_status">;

export type CartOrder = {
  address: string | null;
  created_at: string;
  delivery_fee_cents: number;
  delivery_notes: string | null;
  email: string;
  fulfillment_type: FullfilmentType;
  name: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  phone: string;
  total_cents: number;
  updated_at: string;
  zone_id: string | undefined;
  items: CartItem[];
};

export function useOrders() {
  const createOrder = async (order: CartOrder) => {
    const { user } = useUser();
    if (!user.value) {
      throw new Error("Session not yet ready");
    }

    const { $supabase } = useNuxtApp();
    const { data, error } = await $supabase.rpc("create_order", {
      p_email: order.email,
      p_name: order.name,
      p_phone: order.phone,
      p_fulfillment_type: order.fulfillment_type,
      p_address: order.address,
      p_delivery_notes: order.delivery_notes,
      p_delivery_fee_cents: order.delivery_fee_cents,
      p_zone_id: order.zone_id,
      p_items: order.items.map((i) => ({
        product_id: i.id,
        product_name: i.name,
        quantity: i.quantity,
        unit_price_cents: i.price_cents,
      })),
    });

    if (error) throw error;

    return data;
  };

  return {
    createOrder,
  };
}
