export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number | string;
  image_url?: string | null;
  is_seasonal?: boolean | string;
};

export function useProducts() {
  const { $supabase } = useNuxtApp();

  const getAll = async () => {
    const { data, error } = await $supabase.from("products").select("*");

    if (error) throw error;

    return data;
  };

  const getProductBySlug = async (slug: string) => {
    const { data, error } = await $supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .limit(1);

    if (error) throw error;

    return data[0];
  };

  return {
    getAll,
    getProductBySlug,
  };
}
