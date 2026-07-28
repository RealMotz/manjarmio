create or replace function create_order(
  p_email text,
  p_name text,
  p_phone text,
  p_fulfillment_type fulfillment_type,
  p_zone_id uuid,
  p_address text default null,
  p_delivery_notes text default null,
  p_delivery_fee_cents int default 0,
  p_items jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_items_total_cents int;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  -- compute total from items server-side, don't trust client math
  select sum((item->>'quantity')::int * (item->>'unit_price_cents')::int)
  into v_items_total_cents
  from jsonb_array_elements(p_items) as item;

  insert into orders (
    user_id, email, name, phone, fulfillment_type,
    address, delivery_notes, delivery_fee_cents, zone_id,
    total_cents
  )
  values (
    auth.uid(), p_email, p_name, p_phone, p_fulfillment_type,
    p_address, p_delivery_notes, p_delivery_fee_cents, p_zone_id,
    v_items_total_cents + p_delivery_fee_cents
  )
  returning id into v_order_id;

  insert into order_items (
    order_id, product_id, product_name, quantity, unit_price_cents
  )
  select
    v_order_id,
    (item->>'product_id')::uuid,
    item->>'product_name',
    (item->>'quantity')::int,
    (item->>'unit_price_cents')::int,
  from jsonb_array_elements(p_items) as item;

  return v_order_id;
end;
$$;

grant execute on function create_order(
  text, text, text, fulfillment_type, uuid, text, text, int, jsonb
) to authenticated;