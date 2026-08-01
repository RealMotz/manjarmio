export type Fulfillment = "pickup" | "delivery";

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

  const resetCheckout = () => {
    fulfillment.value = "pickup";
    contactName.value = "";
    phone.value = "";
    email.value = "";
    address.value = "";
    notes.value = "";
    deliveryDate.value = "";
    deliveryTime.value = "";
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
    resetCheckout,
  };
}
