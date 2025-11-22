// FILE: backend/src/utils/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Warehouse = require('../models/warehouse.model');
const Product = require('../models/product.model');
const connectDB = require('../config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('🌱 Starting Database Seed...');

    // 1. Create Admin User
    const userExists = await User.findOne({ email: 'admin@stockmaster.com' });
    if (!userExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      await User.create({
        name: 'System Admin',
        email: 'admin@stockmaster.com',
        password: hashedPassword,
        role: 'admin',
        active: true
      });
      console.log('✅ Admin User Created');
    } else {
      console.log('ℹ️  Admin User already exists');
    }

    // 2. Create Main Warehouse
    const warehouseExists = await Warehouse.findOne({ code: 'WH-MAIN' });
    let mainWarehouse;
    if (!warehouseExists) {
      mainWarehouse = await Warehouse.create({
        name: 'Main Headquarters',
        code: 'WH-MAIN',
        address: '123 Stock Lane, Inventory City',
        active: true
      });
      console.log('✅ Main Warehouse Created');
    } else {
      mainWarehouse = warehouseExists;
      console.log('ℹ️  Main Warehouse already exists');
    }

    // 3. Create Sample Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany([
        {
          name: 'Ergonomic Office Chair',
          sku: 'FURN-CHAIR-001',
          category: 'Furniture',
          uom: 'pcs',
          reorderLevel: 5,
          costPrice: 45.00,
          salesPrice: 120.00,
          description: 'High-back mesh office chair'
        },
        {
          name: 'Wireless Keyboard',
          sku: 'ELEC-KEY-002',
          category: 'Electronics',
          uom: 'pcs',
          reorderLevel: 20,
          costPrice: 15.00,
          salesPrice: 45.00,
          description: 'Mechanical wireless keyboard'
        }
      ]);
      console.log('✅ Sample Products Created');
    } else {
      console.log('ℹ️  Products already exist');
    }

    console.log('\n-----------------------------------');
    console.log('🎉 Seeding Complete!');
    console.log('-----------------------------------');
    console.log('🔑 Admin Credentials:');
    console.log('   Email: admin@stockmaster.com');
    console.log('   Pass:  password123');
    console.log('-----------------------------------');

    process.exit();
  } catch (error) {
    console.error(`❌ Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();