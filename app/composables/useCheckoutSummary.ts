export async function useCheckoutSummary() {
  const { subtotalCents } = useCart();
  const deliverySchedule = useDeliverySchedule();
  const checkout = useCheckout();

  const extrasCents = computed(() =>
    checkout.selectedExtras.value.reduce((sum, id) => {
      const extra = CHECKOUT_EXTRAS.find((option) => option.id === id);
      return sum + (extra?.priceCents ?? 0);
    }, 0),
  );
  const totalCents = computed(() => subtotalCents.value + extrasCents.value);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isCheckoutReady = computed(
    () =>
      checkout.contactName.value.trim().length > 1 &&
      checkout.phone.value.trim().length > 5 &&
      emailPattern.test(checkout.email.value.trim()) &&
      (checkout.fulfillment.value === "pickup" ||
        (checkout.address.value.trim().length > 4 &&
          Boolean(checkout.deliveryDate.value) &&
          Boolean(checkout.deliveryTime.value))),
  );

  const deliveryDateOptions = computed(() =>
    deliverySchedule.getDeliveryDateOptions(),
  );
  const deliveryTimeOptions = deliverySchedule.deliveryTimeSlots;

  const formatHours = (time: { hours: number; minutes: number }) => {
    const reference = new Date();
    reference.setHours(time.hours, time.minutes, 0, 0);
    return reference.toLocaleTimeString("es-CO", {
      hour: "numeric",
      minute: "2-digit",
    });
  };
  const workingHoursStartLabel = computed(() =>
    formatHours(deliverySchedule.workingHours.start),
  );
  const workingHoursEndLabel = computed(() =>
    formatHours(deliverySchedule.workingHours.end),
  );

  return {
    totalCents,
    extrasCents,
    isCheckoutReady,
    deliveryDateOptions,
    deliveryTimeOptions,
    workingHoursStartLabel,
    workingHoursEndLabel,
    ...checkout,
  };
}
