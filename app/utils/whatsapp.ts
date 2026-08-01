import { formatCOP } from "~/utils/currency";

export type WhatsappOrderItem = {
  name: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
};

export type WhatsappFulfillmentDetails =
  | {
      type: "pickup";
      address: string | null;
      hours: string | null;
    }
  | {
      type: "delivery";
      address: string;
      dateLabel: string;
      timeLabel: string;
    };

export type WhatsappOrderExtra = {
  label: string;
  priceCents: number;
  detail?: string;
};

export type WhatsappOrderSummary = {
  orderId?: string;
  items: WhatsappOrderItem[];
  fulfillment: WhatsappFulfillmentDetails;
  subtotalCents: number;
  totalCents: number;
  contactName: string;
  phone: string;
  email: string;
  notes?: string;
  extras?: WhatsappOrderExtra[];
};

export function buildWhatsappOrderMessage(
  summary: WhatsappOrderSummary,
): string {
  const reference = summary.orderId ? ` #${summary.orderId.slice(0, 8)}` : "";
  const lines: string[] = [
    `¡Hola Manjarmío! 🍰 Quiero confirmar mi pedido${reference}`,
    "",
  ];

  lines.push("*Tu pedido:*");
  for (const item of summary.items) {
    lines.push(
      `- ${item.quantity}x ${item.name} — ${formatCOP(item.unitPriceCents)} c/u — ${formatCOP(item.lineTotalCents)}`,
    );
  }
  lines.push("");

  if (summary.fulfillment.type === "pickup") {
    lines.push("*Forma de entrega:* Recoger en tienda");
    if (summary.fulfillment.address)
      lines.push(`📍 ${summary.fulfillment.address}`);
    if (summary.fulfillment.hours)
      lines.push(`🕐 ${summary.fulfillment.hours}`);
  } else {
    lines.push("*Forma de entrega:* Envío a domicilio");
    lines.push(`🏠 ${summary.fulfillment.address}`);
    lines.push(`📅 ${summary.fulfillment.dateLabel}`);
    lines.push(`🕐 ${summary.fulfillment.timeLabel}`);
  }
  lines.push("");

  if (summary.extras && summary.extras.length > 0) {
    lines.push("*Extras:*");
    for (const extra of summary.extras) {
      const detail = extra.detail ? ` — ${extra.detail}` : "";
      lines.push(`- ${extra.label} — ${formatCOP(extra.priceCents)}${detail}`);
    }
    lines.push("");
  }

  lines.push("*Resumen:*");
  lines.push(`Subtotal: ${formatCOP(summary.subtotalCents)}`);
  lines.push(
    `Domicilio: ${summary.fulfillment.type === "delivery" ? "Por definir" : "Sin costo"}`,
  );
  if (summary.extras && summary.extras.length > 0) {
    const extrasTotalCents = summary.extras.reduce(
      (sum, extra) => sum + extra.priceCents,
      0,
    );
    lines.push(`Extras: ${formatCOP(extrasTotalCents)}`);
  }
  lines.push(
    `*Total: ${formatCOP(summary.totalCents)}* ${summary.fulfillment.type === "delivery" ? "+ *domicilio*" : ""}`,
  );
  lines.push("");

  lines.push("*Datos de contacto:*");
  lines.push(summary.contactName);
  lines.push(`📞 ${summary.phone}`);
  lines.push(`✉️ ${summary.email}`);

  if (summary.notes) {
    lines.push("");
    lines.push(`*Notas:* ${summary.notes}`);
  }

  lines.push("");
  lines.push("Gracias, quedo atento a la confirmación 🙌");

  return lines.join("\n");
}

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function buildWhatsappLink(
  businessNumber: string,
  message: string,
): string {
  const digitsOnly = businessNumber.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);

  return isMobileDevice()
    ? `whatsapp://send?phone=${digitsOnly}&text=${encodedMessage}`
    : `https://web.whatsapp.com/send?phone=${digitsOnly}&text=${encodedMessage}`;
}

export function openWhatsapp(url: string) {
  if (url.startsWith("whatsapp://")) {
    window.location.href = url;
    return;
  }

  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
