SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict YDQCg3FMzQhTHPnYp5Oih6MlDtX994d7Brmsw4gVsrlOJ1eDwJJaFuI0vwJyh2p

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--




--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--




--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--




--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--




--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: delivery_zones; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."delivery_zones" ("id", "name", "fee_cents", "is_active", "sort_order") VALUES
	('1624cbaa-f4c6-4c34-ae7d-18882c3625f4', 'Centro y San Antonio', 500000, true, 1),
	('95d53384-2ec4-4822-be85-e9edc68c0ba6', 'Norte (Granada, Ciudad Jardín)', 700000, true, 2),
	('2548ccfd-5c81-482f-9bcd-64d02af06c19', 'Oeste (San Pedro, Tequendama)', 700000, true, 4),
	('0881ec82-40e8-4e55-9125-a277c690b9e5', 'Este (El Limonar, Santa Rita)', 750000, true, 5),
	('5fca1ee6-880f-4e2c-8083-025cd25680c7', 'Sur (Meléndez, Pance)', 700000, true, 3);


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "slug", "name", "description", "price_cents", "image_url", "is_seasonal", "is_active", "sort_order", "created_at", "updated_at") VALUES
	('1d542817-3ee0-4ce2-bbd4-c68f5873e3fc', 'maracumango', 'Maracumango', 'Una combinación tropical que equilibra la intensidad ácida del maracuyá con la dulzura natural del mango, sobre una suave crema de mascarpone. Fresco, ligero e irresistiblemente frutal. Porción individual de 200 g.', 2200000, '', false, true, 2, '2026-06-25 01:14:02.663772+00', '2026-06-25 01:14:02.663772+00'),
	('d7d907b6-b7a6-4bff-afcd-57ef23102e77', 'clasico', 'Clásico', 'La receta original: mascarpone cremoso, café espresso de origen y capa generosa de cacao amargo. Porción individual de 200 g.', 2200000, '', false, true, 5, '2026-06-25 01:14:02.663772+00', '2026-06-25 01:34:39.373+00'),
	('ad825f01-99b9-4c77-8eb1-93d835a5cc8d', 'kinder', 'Kinder Bueno', 'Inspirado en el icónico chocolate Kinder Bueno: una cremosa mezcla de avellanas, chocolate con leche y delicadas capas de tiramisú que se derriten en cada bocado. Un placer para los amantes del chocolate. Porción individual de 200 g.', 2800000, '', false, true, 3, '2026-07-25 22:42:15+00', '2026-07-25 22:42:18+00'),
	('c1ae8fe2-4eb7-44ca-bef9-b16b14f432e8', 'caramelo-salado', 'Caramelo salado', 'La combinación perfecta entre dulce y salado: un suave caramelo artesanal con un toque de sal marina que realza la cremosidad del mascarpone. Un sabor intenso, elegante y adictivo. Porción individual de 200 g.', 2200000, '', false, true, 4, '2026-06-25 01:14:02.663772+00', '2026-06-25 01:14:02.663772+00'),
	('022d32e2-d5fc-459f-b1c2-1677c6b284c9', 'pistaccio', 'Pistaccio', 'Elaborado con una cremosa pasta de pistacho que aporta un sabor delicado, ligeramente tostado y lleno de personalidad. Una combinación elegante que convierte cada cucharada en una experiencia irresistible. Porción individual de 200 g.', 2800000, '', false, true, 1, '2026-07-25 22:44:53.743227+00', '2026-07-25 22:44:53.743227+00'),
	('808cc1d7-6d21-4d47-8137-12bd5b805f51', 'temporada-especial', 'Edición de temporada', 'Sabor rotativo según la estación. Consulta el sabor del mes al hacer tu pedido. Porción individual de 150 g.', 2200000, '', true, false, 0, '2026-06-25 01:14:02.663772+00', '2026-06-25 01:14:02.663772+00'),
	('ec2f7023-4472-4d93-8bf2-f86b246124c9', 'nutella', 'Nutella', 'Contraste tropical: crema de mascarpone con coulis de maracuyá fresco del Valle. Ácido, cremoso y adictivo.', 2800000, '', false, false, 0, '2026-06-25 01:14:02.663772+00', '2026-06-25 01:14:02.663772+00'),
	('a6f32464-e22a-459e-bea2-a92296ff4e76', 'fresa', 'Fresa', 'Chocolate 70% de origen, mascarpone y café intenso. Para quienes prefieren menos dulce y más profundidad.', 2200000, '', true, false, 0, '2026-06-25 01:14:02.663772+00', '2026-06-25 01:14:02.663772+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('images', 'images', NULL, '2026-06-26 00:52:31.196373+00', '2026-06-26 00:52:31.196373+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--




--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 2, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict YDQCg3FMzQhTHPnYp5Oih6MlDtX994d7Brmsw4gVsrlOJ1eDwJJaFuI0vwJyh2p

RESET ALL;
