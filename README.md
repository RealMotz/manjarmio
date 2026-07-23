# Manjarmio

Manjarmio is an online storefront for handcrafted tiramisu in Cali, Colombia. Customers can explore the catalogue, build a cart, choose pickup or delivery, and see delivery fees for active service zones.

Data is served from Supabase. The checkout experience is ready for a future Wompi payment integration; payments are not processed yet.

## Run locally

Create a `.env` file with `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`. `PICKUP_ADDRESS` and `PICKUP_HOURS` are optional.

```bash
npm install
npm run dev
```

Build for production with:

```bash
npm run build
```

## Run with Docker

Create a `.env` file as described above, then build and start the production
server:

```bash
docker compose up --build
```

The storefront will be available at [http://localhost:3000](http://localhost:3000).
