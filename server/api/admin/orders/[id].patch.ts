import { Constants } from "~~/database.types.ts";
import type { TablesUpdate } from "~~/database.types.ts";

type OrderPatch = TablesUpdate<"orders">;

const EDITABLE_FIELDS = [
  "order_status",
  "total_cents",
  "delivery_fee_cents",
] as const;

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing order id" });
  }

  const body = await readBody<Record<string, unknown>>(event);
  const patch: OrderPatch = {};

  for (const field of EDITABLE_FIELDS) {
    if (!(field in body)) continue;
    const value = body[field];

    if (field === "order_status") {
      if (!Constants.public.Enums.order_status.includes(value as never)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid order_status: ${value}`,
        });
      }
      patch.order_status = value as OrderPatch["order_status"];
    } else if (field === "total_cents") {
      if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
        throw createError({
          statusCode: 400,
          statusMessage: "total_cents must be a non-negative integer",
        });
      }
      patch.total_cents = value;
    } else if (field === "delivery_fee_cents") {
      if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
        throw createError({
          statusCode: 400,
          statusMessage: "delivery_fee_cents must be a non-negative integer",
        });
      }
      patch.delivery_fee_cents = value;
    }
  }

  if (Object.keys(patch).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "No valid fields to update",
    });
  }

  const supabase = useSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders")
    .update(patch)
    .eq("id", id)
    .select("*, order_items(*)")
    .single();

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return data;
});
