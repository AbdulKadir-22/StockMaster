# 📦 StockMaster Backend

A modular **Inventory Management System (IMS)** backend built with **Node.js**, **Express**, and **Mongoose**.

---

## 🚀 Setup & Installation

### 1. Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)

---

### 2. Installation

```bash
cd backend
npm install
````

---

### 3. Environment Variables

Create a `.env` file in the backend root:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/stockmaster
NODE_ENV=development
JWT_SECRET=supersecretkey123
```

---

### 4. Database Seeding

Initialize the database with an Admin user + demo data:

```bash
node src/utils/seed.js
# or if configured:
npm run seed
```

**Default Admin Credentials**

```
Email: admin@stockmaster.com  
Password: password123
```

---

### 5. Run Server

```bash
npm run dev
```

---

## 📡 API Documentation & cURL Examples

Assuming the server is running at:
**[http://localhost:5000](http://localhost:5000)**

---

# 🔐 1. Authentication

### Login (Get JWT Token):

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@stockmaster.com",
    "password": "password123"
  }'
```

⚠️ **Save the `<TOKEN>`** from the response — you'll need it for all other calls.

---

# 📦 2. Products

### Create Product

```bash
curl -X POST http://localhost:5000/products \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "sku": "TECH-LAP-999",
    "category": "Electronics",
    "uom": "unit",
    "reorderLevel": 5,
    "costPrice": 800,
    "salesPrice": 1200
  }'
```

---

# 🏭 3. Warehouses

### Create Warehouse

```bash
curl -X POST http://localhost:5000/warehouses \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "East Coast Distribution",
    "code": "WH-EAST",
    "address": "456 Harbor Blvd, NY"
  }'
```

---

# 📥 4. Receipts (Incoming Stock)

### Step A: Create Draft Receipt

```bash
curl -X POST http://localhost:5000/receipts \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "receiptNumber": "REC-001",
    "supplier": "Tech Supplies Inc",
    "warehouse": "<WAREHOUSE_ID>",
    "items": [
        { "product": "<PRODUCT_ID>", "quantity": 50 }
    ]
  }'
```

### Step B: Validate Receipt (Increase Stock)

```bash
curl -X POST http://localhost:5000/receipts/<RECEIPT_ID>/validate \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json"
```

---

# 🚚 5. Deliveries (Outgoing Stock)

### Step A: Create Draft Delivery

```bash
curl -X POST http://localhost:5000/deliveries \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryNumber": "DEL-001",
    "customer": "John Doe",
    "warehouse": "<WAREHOUSE_ID>",
    "items": [
        { "product": "<PRODUCT_ID>", "quantity": 5 }
    ]
  }'
```

### Step B: Validate Delivery (Decrease Stock)

```bash
curl -X POST http://localhost:5000/deliveries/<DELIVERY_ID>/validate \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json"
```

---

# 🔄 6. Internal Transfers

### Step A: Create Draft Transfer

```bash
curl -X POST http://localhost:5000/transfers \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "transferNumber": "TRF-001",
    "sourceWarehouse": "<SOURCE_WAREHOUSE_ID>",
    "destinationWarehouse": "<DEST_WAREHOUSE_ID>",
    "items": [
        { "product": "<PRODUCT_ID>", "quantity": 10 }
    ]
  }'
```

### Step B: Execute Transfer

```bash
curl -X POST http://localhost:5000/transfers/<TRANSFER_ID>/execute \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json"
```

---

# 📊 7. Dashboard

### Get Summary

```bash
curl -X GET http://localhost:5000/dashboard/summary \
  -H "Authorization: Bearer <TOKEN>"
```

### Get Low Stock Alerts

```bash
curl -X GET http://localhost:5000/dashboard/low-stock \
  -H "Authorization: Bearer <TOKEN>"
```

