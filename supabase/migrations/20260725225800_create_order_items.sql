CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL PRIMARY KEY,
    "order_id" "uuid" NOT NULL REFERENCES "public"."orders"("id") ON DELETE CASCADE,
    "product_id" "uuid" NOT NULL REFERENCES "public"."products"("id") ON DELETE RESTRICT,
    "product_name" "text" NOT NULL,        -- snapshot at time of order
    "unit_price_cents" integer NOT NULL,   -- snapshot at time of order
    "quantity" integer NOT NULL CHECK ("quantity" > 0),
    "line_total_cents" integer GENERATED ALWAYS AS ("quantity" * "unit_price_cents") STORED,   -- unit_price_cents * quantity, stored for easy reporting
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

CREATE INDEX ON "public"."order_items" ("order_id");
CREATE INDEX ON "public"."order_items" ("product_id");

ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;