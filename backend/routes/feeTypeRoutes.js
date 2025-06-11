const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
// const { protect, authorize } = require('../middleware/authMiddleware'); // Sẽ thêm sau



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