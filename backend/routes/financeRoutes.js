const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
// const { protect, authorize } = require('../middleware/authMiddleware'); // Sẽ thêm sau

// ======================= TRẠM KIỂM SOÁT DEBUG =======================
router.use((req, res, next) => {
  console.log(`>>>> [DEBUG] Request đã vào financeRoutes! Method: ${req.method}, URL: ${req.originalUrl}`);
  next(); // Quan trọng: Cho phép request đi tiếp đến các route bên dưới
});
// ====================================================================


// Áp dụng middleware để bảo vệ tất cả các route bên dưới
// router.use(protect);
// router.use(authorize('Kế toán')); // Chỉ kế toán mới được truy cập

router.route('/')
  .get(financeController.getAllFeeTypes)
  .post(financeController.createFeeType);

router.route('/:id')
  .get(financeController.getFeeTypeById)
  .put(financeController.updateFeeType)
  .delete(financeController.deleteFeeType);

module.exports = router;