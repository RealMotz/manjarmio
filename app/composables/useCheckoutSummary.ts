export async function useCheckoutSummary() {
  const { subtotalCents } = useCart();
  const deliveryZonesApi = useDeliveryZones();
  const deliverySchedule = useDeliverySchedule();
  const checkout = useCheckout();

  const {
    data: deliveryZones,
    pending: deliveryZonesPending,
    error: deliveryZonesError,
  } = await useAsyncData("active-delivery-zones", () => deliveryZonesApi.getAll());
  const activeZones = deliveryZones.value?.filter((zone) => zone.is_active == true);
  const pickup = deliveryZones.value?.at(0);

  const selectedZone = computed(
    () => deliveryZones.value?.find((zone) => zone.id === checkout.selectedZoneId.value) ?? null,
  );
  const deliveryFeeCents = computed(() =>
    checkout.fulfillment.value === "delivery" ? selectedZone.value?.fee_cents ?? 0 : 0,
  );
  const totalCents = computed(() => subtotalCents.value + deliveryFeeCents.value);
  const requiresZone = computed(
    () => checkout.fulfillment.value === "delivery" && (activeZones?.length ?? 0) > 0,
  );

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isCheckoutReady = computed(
    () =>
      checkout.contactName.value.trim().length > 1 &&
      checkout.phone.value.trim().length > 5 &&
      emailPattern.test(checkout.email.value.trim()) &&
      (checkout.fulfillment.value === "pickup" ||
        (Boolean(selectedZone.value) &&
          checkout.address.value.trim().length > 4 &&
          Boolean(checkout.deliveryDate.value) &&
          Boolean(checkout.deliveryTime.value))),
  );

  const deliveryDateOptions = computed(() => deliverySchedule.getDeliveryDateOptions());
  const deliveryTimeOptions = deliverySchedule.deliveryTimeSlots;

  const formatHours = (time: { hours: number; minutes: number }) => {
    const reference = new Date();
    reference.setHours(time.hours, time.minutes, 0, 0);
    return reference.toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit" });
  };
  const workingHoursStartLabel = computed(() => formatHours(deliverySchedule.workingHours.start));
  const workingHoursEndLabel = computed(() => formatHours(deliverySchedule.workingHours.end));

  return {
    deliveryZones,
    deliveryZonesPending,
    deliveryZonesError,
    activeZones,
    pickup,
    selectedZone,
    deliveryFeeCents,
    totalCents,
    requiresZone,
    isCheckoutReady,
    deliveryDateOptions,
    deliveryTimeOptions,
    workingHoursStartLabel,
    workingHoursEndLabel,
    ...checkout,
  };
}
