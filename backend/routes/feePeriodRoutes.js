// routes/feePeriodRoutes.js
const express = require('express');
const router = express.Router();
const feePeriodController = require('../controllers/feePeriodController'); // Bạn sẽ cần tạo controller này
const financeController = require('../controllers/financeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Tất cả các route dưới đây đều yêu cầu đăng nhập và phải là Kế toán
router.use(protect);
router.use(authorize('Kế toán'));

// Route CRUD cho Đợt thu (bạn sẽ cần tạo các hàm này trong controller)
router.route('/')
  .get(feePeriodController.getAllFeePeriods)
  .post(feePeriodController.createFeePeriod);

// Route để lấy thông tin chi tiết của một Đợt thu
router.route('/:id')
  .get(feePeriodController.getFeePeriodById);

// Route đặc biệt để lập hóa đơn
router.post('/:feePeriodId/generate-invoices', financeController.generateInvoices);

module.exports = router;