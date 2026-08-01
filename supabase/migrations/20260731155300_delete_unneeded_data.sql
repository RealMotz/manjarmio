ALTER TABLE "public"."orders" DROP COLUMN zone_id CASCADE;
DROP TABLE "public"."delivery_zones";

ALTER TABLE "public"."orders" DROP COLUMN payment_status;
DROP TYPE payment_status;