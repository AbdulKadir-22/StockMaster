// FILE: backend/src/routes/dashboard.routes.js
const express = require('express');
const { getSummary, getLowStock } = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/low-stock', getLowStock);

module.exports = router;