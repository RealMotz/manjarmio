import type { OrderStatus, PaymentStatus } from "~/composables/useOrder";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "new",
  "preparing",
  "delivered",
];

export const ORDER_STATUS_COLUMNS: OrderStatus[] = [
  ...ORDER_STATUS_FLOW,
  "cancelled",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Nuevo",
  preparing: "Preparando",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export const ORDER_STATUS_STYLES: Record<
  OrderStatus,
  { bg: string; text: string; border: string }
> = {
  new: { bg: "bg-sky/10", text: "text-sky", border: "border-sky/30" },
  preparing: {
    bg: "bg-saffron/10",
    text: "text-saffron",
    border: "border-saffron/30",
  },
  delivered: {
    bg: "bg-cocoa/10",
    text: "text-cocoa",
    border: "border-cocoa/30",
  },
  cancelled: {
    bg: "bg-espresso/10",
    text: "text-espresso/60",
    border: "border-espresso/20",
  },
};

export function nextOrderStatus(status: OrderStatus): OrderStatus | null {
  const idx = ORDER_STATUS_FLOW.indexOf(status);
  if (idx === -1 || idx === ORDER_STATUS_FLOW.length - 1) return null;
  return ORDER_STATUS_FLOW[idx + 1];
}
