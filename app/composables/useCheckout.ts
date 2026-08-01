export type Fulfillment = "pickup" | "delivery";

export type ExtraId = "custom_message" | "birthday_card";

export type ExtraOption = {
  id: ExtraId;
  label: string;
  description: string;
  icon: string;
  priceCents: number;
  inputType: "text" | "textarea";
  inputLabel: string;
  inputPlaceholder: string;
};

export const CHECKOUT_EXTRAS: ExtraOption[] = [
  {
    id: "custom_message",
    label: "Mensaje personalizado",
    description: "¿Agregar un mensaje?",
    icon: "✎",
    priceCents: 200000,
    inputType: "textarea",
    inputLabel: "Tu mensaje",
    inputPlaceholder: "Escribe aquí tu mensaje…",
  },
  {
    id: "birthday_card",
    label: "Tarjeta de cumpleaños",
    description: "¿Incluir tarjeta?",
    icon: "🎂",
    priceCents: 200000,
    inputType: "textarea",
    inputLabel: "¿Para quién es?",
    inputPlaceholder: "Nombre de quien cumple años",
  },
];

export function useCheckout() {
  const fulfillment = useState<Fulfillment>(
    "checkout-fulfillment",
    () => "pickup",
  );

  const pickupLocation = useState("checkout-location", () => "");
  const contactName = useState("checkout-contact-name", () => "");
  const phone = useState("checkout-phone", () => "");
  const email = useState("checkout-email", () => "");
  const address = useState("checkout-address", () => "");
  const notes = useState("checkout-notes", () => "");
  const deliveryDate = useState("checkout-delivery-date", () => "");
  const deliveryTime = useState("checkout-delivery-time", () => "");
  const selectedExtras = useState<ExtraId[]>("checkout-extras", () => []);
  const extraDetails = useState<Record<ExtraId, string>>(
    "checkout-extra-details",
    () => ({ custom_message: "", birthday_card: "" }),
  );

  const toggleExtra = (id: ExtraId) => {
    selectedExtras.value = selectedExtras.value.includes(id)
      ? selectedExtras.value.filter((extraId) => extraId !== id)
      : [...selectedExtras.value, id];
  };

  const resetCheckout = () => {
    fulfillment.value = "pickup";
    contactName.value = "";
    phone.value = "";
    email.value = "";
    address.value = "";
    notes.value = "";
    deliveryDate.value = "";
    deliveryTime.value = "";
    selectedExtras.value = [];
    extraDetails.value = { custom_message: "", birthday_card: "" };
  };

  return {
    fulfillment,
    contactName,
    phone,
    email,
    address,
    notes,
    deliveryDate,
    deliveryTime,
    pickupLocation,
    selectedExtras,
    extraDetails,
    toggleExtra,
    resetCheckout,
  };
}
