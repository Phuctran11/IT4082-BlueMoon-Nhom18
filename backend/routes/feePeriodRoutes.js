const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

// ... (các route CRUD)

// Route đặc biệt để lập hóa đơn
router.post('/:feePeriodId/generate-invoices', financeController.generateInvoices);

module.exports = router;