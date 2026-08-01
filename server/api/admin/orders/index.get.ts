export default defineEventHandler(async (event) => {
  await requireAdminSession(event);

  const supabase = useSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return data;
});
