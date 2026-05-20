### Group Name and Members

| Name             | ID                  |  Section       |
|------------------|---------------------|----------------|
| Wabi Tena        | UGR/37898/17        |      1         |
| Yeroman Diriba   | UGR/37967/17        |      2         |
| Elsabet Wondimu  | UGR/36775/17        |      2         |
| Biniam Gululat   | UGR/38342/17        |      1         |
| Adana Mitiku     | UGR/36373/17        |      2         |
| Lemi Megersa     | UGR/37310/17        |      2         |



# Nimbus Delivery Platform

Production-style food delivery stack with a React (Vite) glassmorphism UI, Express REST API, JWT auth, and MySQL persistence modeled after marketplace platforms.

## Prerequisites

- Node.js 18+
- MySQL 8+ (or compatible)
- npm

## 1. Database

Create a database and import the schema:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS delivery_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p delivery_app < backend/database/schema.sql
```

If you already initialized an older schema, apply additive migrations once:

```bash
mysql -u root -p delivery_app < backend/database/migrations/002_notifications_posts_profile.sql
```

Ignore duplicate-column errors if you selectively ran statements previously — rerunning `CREATE TABLE IF NOT EXISTS` is safe.

Seed demo users, a kitchen, categories, and dishes:

```bash
cd backend
cp .env.example .env   # Windows: copy .env.example .env — then edit credentials
npm install
npm run seed
```

### Demo accounts (after `npm run seed`)

| Role     | Email               | Password        |
|----------|---------------------|-----------------|
| Admin    | admin@demo.com      | Admin12345!     |
| Customer | customer@demo.com   | Customer12345!  |
| Vendor   | vendor@demo.com     | Vendor12345!    |
| Courier  | delivery@demo.com   | Delivery12345!  |

## 2. Backend API

```bash
cd backend
# configure DB + JWT in .env
npm run dev        # or npm start
```

Default URL: `http://localhost:4000`  
Health check: `GET /api/health`

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` to `http://localhost:4000`.

Optional: set `VITE_API_URL` in `frontend/.env` to point at a remote API (see `frontend/.env.example`).

## Primary user flows

1. **Customer** — browse `/products`, add to cart (JWT required), `/checkout`, pay with **Pay now (mock)** on the tracking screen, optionally **Simulate next step** for a DoorDash-style lifecycle animation.
2. **Vendor** — register with role `vendor`, complete kitchen profile in Dashboard → Vendor ops, manage incoming tickets and catalog CRUD.
3. **Courier** — register with role `delivery`, open **Courier** in the navbar when orders hit `ready_for_pickup`, claim from `/delivery`.

## Project layout

```
backend/
  config/           # centralized env-driven settings
  controllers/      # HTTP orchestration (MVC)
  database/         # schema + seed helpers
  middlewares/      # auth, validation, errors
  models/           # SQL data access
  routes/           # Express routers
  scripts/seed.js   # deterministic demo data (bcrypt hashes)

frontend/
  src/components/   # UI primitives, chatbot, particles, layout
  src/context/      # theme + dark mode persistence
  src/pages/        # routed screens
  src/services/     # Axios client + API helpers
  src/store/        # Zustand auth persistence
```

## Security notes

- Replace `JWT_SECRET` with a long random string before any real deployment.
- The payment flow is intentionally mocked (`payments` table + `/api/payments/order/:orderId/complete`).
- Never commit real `.env` files—only `.env.example`.

## Scripts summary

| Location | Command      | Purpose                |
|----------|--------------|------------------------|
| backend  | `npm run dev`| Restart API on changes |
| backend  | `npm run seed` | Demo dataset        |
| frontend | `npm run dev`| Vite dev server        |
| frontend | `npm run build` | Optimized bundle    |


More SQL Code present in Controllers,Models....... Check Them out

Happy shipping!
