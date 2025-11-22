// FILE: backend/tests/integration.test.js
const request = require('supertest');
const app = require('../server'); // Ensure server.js has: module.exports = app;
const { connectDB, clearDatabase, closeDatabase } = require('./setup');
const StockItem = require('../src/models/stockItem.model');

// Constants for test data
const ADMIN_USER = {
  name: 'Test Admin',
  email: 'admin@test.com',
  password: 'password123',
  role: 'admin'
};

const WAREHOUSE_DATA = {
  name: 'Test Warehouse',
  code: 'WH-TEST',
  address: '123 Test Lane'
};

const PRODUCT_DATA = {
  name: 'Test Widget',
  sku: 'TEST-SKU-001',
  category: 'Testing',
  uom: 'pcs',
  reorderLevel: 10
};

let token;
let warehouseId;
let productId;

beforeAll(async () => {
  await connectDB();
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('StockMaster Critical User Journey', () => {
  
  // 1. Authentication
  it('Step 1: Should register a new admin and login to get token', async () => {
    // Register
    const resRegister = await request(app)
      .post('/auth/register')
      .send(ADMIN_USER);
    expect(resRegister.statusCode).toBe(201);

    // Login
    const resLogin = await request(app)
      .post('/auth/login')
      .send({ email: ADMIN_USER.email, password: ADMIN_USER.password });
    
    expect(resLogin.statusCode).toBe(200);
    expect(resLogin.body.data.token).toBeDefined();
    
    token = resLogin.body.data.token;
  });

  // 2. Setup Data
  it('Step 2: Should create a Warehouse and a Product', async () => {
    // Create Warehouse
    const resWH = await request(app)
      .post('/warehouses')
      .set('Authorization', `Bearer ${token}`)
      .send(WAREHOUSE_DATA);
    expect(resWH.statusCode).toBe(201);
    warehouseId = resWH.body.data._id;

    // Create Product
    const resProd = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send(PRODUCT_DATA);
    expect(resProd.statusCode).toBe(201);
    productId = resProd.body.data._id;
  });

  // 3. Receipt (Stock In)
  it('Step 3: Should receive 100 items and increase stock', async () => {
    // Create Draft Receipt
    const resDraft = await request(app)
      .post('/receipts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        receiptNumber: 'REC-TEST-001',
        supplier: 'Test Supplier',
        warehouse: warehouseId,
        items: [{ product: productId, quantity: 100 }]
      });
    
    expect(resDraft.statusCode).toBe(201);
    const receiptId = resDraft.body.data._id;

    // Validate Receipt
    const resValidate = await request(app)
      .post(`/receipts/${receiptId}/validate`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(resValidate.statusCode).toBe(200);
    expect(resValidate.body.data.status).toBe('validated');

    // Verify Stock
    const stockItem = await StockItem.findOne({ product: productId, warehouse: warehouseId });
    expect(stockItem.quantity).toBe(100);
  });

  // 4. Delivery (Stock Out)
  it('Step 4: Should deliver 30 items and decrease stock', async () => {
    // Create Draft Delivery
    const resDraft = await request(app)
      .post('/deliveries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        deliveryNumber: 'DEL-TEST-001',
        customer: 'Test Customer',
        warehouse: warehouseId,
        items: [{ product: productId, quantity: 30 }]
      });

    expect(resDraft.statusCode).toBe(201);
    const deliveryId = resDraft.body.data._id;

    // Validate Delivery
    const resValidate = await request(app)
      .post(`/deliveries/${deliveryId}/validate`)
      .set('Authorization', `Bearer ${token}`);

    expect(resValidate.statusCode).toBe(200);
    expect(resValidate.body.data.status).toBe('validated');

    // Verify Stock (100 - 30 = 70)
    const stockItem = await StockItem.findOne({ product: productId, warehouse: warehouseId });
    expect(stockItem.quantity).toBe(70);
  });

  // 5. Ledger
  it('Step 5: Should verify ledger entries exist', async () => {
    const resLedger = await request(app)
      .get('/ledger')
      .set('Authorization', `Bearer ${token}`);
    
    expect(resLedger.statusCode).toBe(200);
    // Expect at least 2 entries (1 Receipt, 1 Delivery)
    expect(resLedger.body.data.items.length).toBeGreaterThanOrEqual(2);
    
    // Check for specific types
    const types = resLedger.body.data.items.map(item => item.type);
    expect(types).toContain('receipt');
    expect(types).toContain('delivery');
  });

  // 6. Failure Case
  it('Step 6: Should fail when trying to deliver more stock than available', async () => {
    // Create Draft Delivery for 1000 items (Stock is 70)
    const resDraft = await request(app)
      .post('/deliveries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        deliveryNumber: 'DEL-TEST-FAIL',
        customer: 'Test Customer',
        warehouse: warehouseId,
        items: [{ product: productId, quantity: 1000 }]
      });

    expect(resDraft.statusCode).toBe(201);
    const deliveryId = resDraft.body.data._id;

    // Validate Delivery - Expect Failure
    const resValidate = await request(app)
      .post(`/deliveries/${deliveryId}/validate`)
      .set('Authorization', `Bearer ${token}`);

    expect(resValidate.statusCode).toBe(400); // Bad Request
    expect(resValidate.body.success).toBe(false);
    // Check if error message relates to insufficient stock
    expect(resValidate.body.error.message).toMatch(/Insufficient stock/i);
  });
});