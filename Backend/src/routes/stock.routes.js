// FILE: backend/src/routes/stock.routes.js
const express = require('express');
const { getStock } = require('../controllers/stock.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getStock);

module.exports = router;