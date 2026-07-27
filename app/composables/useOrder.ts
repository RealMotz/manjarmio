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
};

export function useOrders() {
  const createOrder = async (order: CartOrder) => {
    const { user } = useUser();
    if (!user.value) {
      throw new Error("Session not yet ready");
    }

    const { $supabase } = useNuxtApp();
    const { data, error } = await $supabase
      .from("orders")
      .insert({ ...order, user_id: user.value.id })
      .select()
      .single();

    if (error) throw error;

    return data;
  };

  return {
    createOrder,
  };
}
