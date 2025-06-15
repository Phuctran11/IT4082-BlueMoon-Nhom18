// backend/routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('Kế toán'));

// Route để phát hành hóa đơn hàng loạt
router.post('/generate-from-period/:feePeriodId', invoiceController.generateInvoices);

module.exports = router;