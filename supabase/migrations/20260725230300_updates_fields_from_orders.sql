ALTER TABLE "public"."orders" DROP COLUMN document_type;
ALTER TABLE "public"."orders" DROP COLUMN document_number;
ALTER TABLE "public"."orders" DROP COLUMN subtotal_cents;
ALTER TABLE "public"."orders" DROP COLUMN items;
ALTER TABLE "public"."orders" DROP COLUMN payment_method;
ALTER TABLE public.orders ADD COLUMN user_id uuid NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid();