type ItemInput = {
  product_id: string;
  product_name: string;
  unit_price_cents: number;
  quantity: number;
};

function validateItems(items: unknown): ItemInput[] {
  if (!Array.isArray(items) || items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Order must contain at least one item",
    });
  }

  return items.map((item) => {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof (item as ItemInput).product_id !== "string" ||
      typeof (item as ItemInput).product_name !== "string" ||
      !Number.isInteger((item as ItemInput).unit_price_cents) ||
      (item as ItemInput).unit_price_cents < 0 ||
      !Number.isInteger((item as ItemInput).quantity) ||
      (item as ItemInput).quantity <= 0
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid line item",
      });
    }

    const { product_id, product_name, unit_price_cents, quantity } =
      item as ItemInput;
    return { product_id, product_name, unit_price_cents, quantity };
  });
}

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing order id" });
  }

  const body = await readBody<{ items?: unknown }>(event);
  const items = validateItems(body.items);

  const supabase = useSupabaseAdmin();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("delivery_fee_cents")
    .eq("id", id)
    .single();

  if (orderError) {
    throw createError({ statusCode: 404, statusMessage: "Order not found" });
  }

  const { error: deleteError } = await supabase
    .from("order_items")
    .delete()
    .eq("order_id", id);
  if (deleteError) {
    throw createError({ statusCode: 500, statusMessage: deleteError.message });
  }

  const { error: insertError } = await supabase
    .from("order_items")
    .insert(items.map((item) => ({ ...item, order_id: id })));

  if (insertError) {
    throw createError({ statusCode: 500, statusMessage: insertError.message });
  }

  const itemsTotalCents = items.reduce(
    (sum, item) => sum + item.unit_price_cents * item.quantity,
    0,
  );
  const totalCents = itemsTotalCents + order.delivery_fee_cents;

  const { data, error } = await supabase
    .from("orders")
    .update({ total_cents: totalCents })
    .eq("id", id)
    .select("*, order_items(*)")
    .single();

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return data;
});
