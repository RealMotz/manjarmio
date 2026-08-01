ALTER TABLE "public"."orders" DROP COLUMN order_status;
DROP TYPE order_status;
CREATE TYPE "public"."order_status" AS ENUM (
    'new',
    'preparing',
    'delivered',
    'cancelled'
);
ALTER TYPE "public"."order_status" OWNER TO "postgres";
ALTER TABLE "public"."orders" ADD COLUMN order_status "public"."order_status" NOT NULL DEFAULT 'new';
