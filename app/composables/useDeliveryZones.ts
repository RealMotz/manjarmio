export type DeliveryZone = {
  id: string;
  name: string;
  fee_cents: number;
  is_active: boolean;
  sort_order: number;
};

export function useDeliveryZones() {
  const { $supabase } = useNuxtApp();

  const getActive = async (): Promise<DeliveryZone[]> => {
    const { data, error } = await $supabase
      .from("delivery_zones")
      .select("*")
      .eq("is_active", true);

    if (error) throw error;

    return ((data ?? []) as DeliveryZone[])
      .map((zone) => ({
        id: zone.id,
        name: zone.name,
        fee_cents: Number(zone.fee_cents),
        is_active: zone.is_active,
        sort_order: zone.sort_order,
      }))
      .filter((zone) => Number.isFinite(zone.fee_cents) && zone.fee_cents >= 0)
      .sort((z1, z2) => z1.sort_order - z2.sort_order);
  };

  return { getActive };
}
