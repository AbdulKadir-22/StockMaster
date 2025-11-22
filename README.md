# StockMaster — Application Overview & About

*A steady ledger of intent, distilled into practical instructions: this document lives at the project root and explains what StockMaster is, how the pieces fit together, where to find the deeper docs, and how to get the entire system running for development or demo.*

---

## Table of Contents

1. [What is StockMaster](#what-is-stockmaster)
2. [High-level Architecture](#high-level-architecture)
3. [Core Capabilities (MVP)](#core-capabilities-mvp)
4. [Repository layout & where to find docs](#repository-layout--where-to-find-docs)
5. [Quick start (dev) — run the full stack locally](#quick-start-dev---run-the-full-stack-locally)
6. [Environment variables (summary)](#environment-variables-summary)
7. [Data model & important invariants](#data-model--important-invariants)
8. [API & Frontend docs (local paths)](#api--frontend-docs-local-paths)
9. [Developer workflow & staging/demo script](#developer-workflow--stagingdemo-script)
10. [Security, testing, and production notes](#security-testing-and-production-notes)
11. [Contributors & contacts](#contributors--contacts)
12. [License & attribution](#license--attribution)

---

## What is StockMaster

StockMaster is a lightweight, multi-warehouse Inventory Management System (IMS).
Its purpose: replace scattered spreadsheets and manual registers with a single, auditable, real-time app to manage products, receipts, deliveries, transfers, and adjustments — with an append-only ledger for reconciliation.

This repository contains the full stack for the 8-page MVP:

* Backend (Node/Express/Mongoose) — APIs and transactional stock logic
* Frontend (React + Vite + standard CSS) — the 8 core UI pages for the demo

---

## High-level Architecture

* **Backend**

  * Express / Mongoose app exposing a REST API.
  * JWT-based auth, roles (inventory_manager, warehouse_staff, admin), OTP password reset flow.
  * Atomic stock mutations implemented with MongoDB transactions and an append-only `LedgerEntry`.
* **Frontend**

  * React (Vite) single-page app.
  * Auth context (JWT), Axios wrapper that unwraps the server response envelope, mobile-first responsive components (standard CSS).
* **Data Layer**

  * Primary current-state: `StockItem` documents (`product + warehouse + location`).
  * Truth ledger: `LedgerEntry` records every validated movement (receipt/delivery/transfer/adjustment).

---

## Core Capabilities (MVP)

The demo focuses on the core lifecycle:

* Create product (SKU, UoM, reorder level)
* Record receipts (incoming goods) — validate to increase stock
* Record deliveries (outgoing goods) — validate to decrease stock
* View a dashboard of KPIs & low-stock alerts
* Inspect ledger entries for auditability

These flows are optimized for an 8–10 hour hackathon demo and are end-to-end integrated.

---

## Repository layout & where to find docs

Top-level layout (only the essential parts shown):

```
/backend/         -> Backend API + API docs (see backend/README.md)
 /src/
 /README.md       -> Backend API docs (detailed)
 
/frontend/        -> Frontend app + frontend docs (see frontend/README.md)
 /src/
 /README.md       -> Frontend implementation notes & components
```

**This file (`APPLICATION.md`)** sits at the project root and links to both backend and frontend docs, plus contains global info about running and deploying the full system.

---

## Quick start (dev) — run the full stack locally

> The steps below assume you have Node.js and a MongoDB instance (local or Atlas).

1. **Backend**

   ```bash
   cd backend
   cp .env.example .env
   # edit .env: set MONGODB_URI, JWT_SECRET, etc.
   npm install
   npm run seed   # seeds admin user and sample data
   npm run dev
   ```

   Backend should start (default `PORT` in `.env`).

2. **Frontend**

   ```bash
   cd frontend
   cp .env.example .env
   # set VITE_API_BASE_URL to backend URL, e.g. http://localhost:5000
   npm install
   npm run dev
   ```

   Frontend will open at `http://localhost:5173` (Vite default) and call the backend via `VITE_API_BASE_URL`.

3. **Demo flow**

   * Register or use seeded admin (see backend seed output).
   * Log in → Dashboard → Create product → Create receipt → Validate → Create delivery → Validate → Check ledger & dashboard KPIs.

---

## Environment variables (summary)

**Backend** (`backend/.env` / `.env.example`):

* `PORT` — server port
* `MONGODB_URI` — MongoDB connection string
* `JWT_SECRET` — JWT signing secret
* `JWT_EXPIRES_IN` — token expiry (e.g., `7d`)
* `BCRYPT_SALT_ROUNDS` — typically `10`

**Frontend** (`frontend/.env` / `.env.example`):

* `VITE_API_BASE_URL` — e.g., `http://localhost:5000`

Make sure secrets are never committed. Use `.env.example` as template.

---

## Data model & important invariants

Short summary of the canonical models and invariants (the authoritative model lives in the backend `src/models/` files):

* **Product**: name, sku (unique), uom, reorderLevel, archived flag.
* **Warehouse**: name, code (unique), address.
* **StockItem**: product (ref), warehouse (ref), location, quantity, reserved — unique index on `(product, warehouse, location)`; this is the current-state table.
* **LedgerEntry**: immutable log; every validated receipt/delivery/transfer/adjustment creates ledger rows.
* **Operation invariants**: All stock mutations are done in a single mongoose transaction that updates `StockItem` and inserts `LedgerEntry` rows; operation document status updated atomically.

If you need the exact schema, see: `backend/src/models/*.js`.

---

## API & Frontend docs (local paths)

Your detailed API documentation lives under the backend folder and the frontend docs under the frontend folder. For quick reference, the following local files are available in this project workspace:

* Backend product & API spec (uploaded reference PDF):
  `/mnt/data/StockMaster.pdf`

* UI screens reference (uploaded):
  `/mnt/data/screens.pdf`

* Backend README (detailed API documentation):
  `backend/README.md`

* Frontend README (implementation & component notes):
  `frontend/README.md`

> These two READMEs are the canonical, per-layer documents. Use `APPLICATION.md` for cross-cutting info and runbook steps like the above.
> The file paths above (e.g. `/mnt/data/StockMaster.pdf`) are available locally in the project environment for designers and devs to consult.

---

## Developer workflow & staging/demo script

**Recommended short workflow** for quick iterations:

1. Branch off `feature/<your-name>/<task>`.
2. Make small commits that implement a single page or single API-integration.
3. Push and open pull requests early — reviewers can run the subset locally.
4. Use the seeded admin user for end-to-end testing.

**Demo script (copy-paste for judges)**

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser → Frontend URL → Login as seeded admin (or register)
4. Create a product: Products → Add Product (fill name, SKU, UoM)
5. Receive goods: Receipts → New Receipt → Add product qty → Create & Validate
6. Ship goods: Deliveries → New Delivery → Add product qty → Create & Validate
7. Open Dashboard → show KPIs update → Open Ledger → show corresponding ledger entries
8. (Optional) Export stock CSV from Stock page (if implemented)

---

## Security, testing, and production notes

* **Auth & roles**: Protect admin-level endpoints (role checks in backend). Keep `JWT_SECRET` safe.
* **Input validation**: Backend uses `express-validator` and returns `VALIDATION_ERROR` envelope; frontend must display these errors.
* **Transactions**: All mutating operations use MongoDB sessions in backend; do not bypass transactional endpoints.
* **Rate limiting / logging**: For demo, basic logging is enabled; add rate-limiting and request logging for production.
* **Data backups**: For production, enable MongoDB backups and snapshot the ledger frequently.
* **CORS**: Ensure `VITE_API_BASE_URL` is allowed in backend CORS settings.

---

## Contributors & contacts

* Project owner / lead: Abdulkadir
* Backend lead: Abdulkadir — see `backend/README.md` for API details
* Frontend lead: Rukshana & Abdulkadir — see `frontend/README.md` for UI details

---

## License & attribution

* Specify project license (e.g., MIT). Add `LICENSE` at repo root.
* Acknowledge third-party assets and libraries in backend/frontend `README.md`.

---

## Final notes

This root-level `APPLICATION.md` is the cross-cutting, operational guide for developers, designers, and judges. It does not replace the backend or frontend docs; instead it connects them and gives a clear runbook for running, testing, and demoing StockMaster.
