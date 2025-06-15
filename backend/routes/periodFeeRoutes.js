const express = require('express');
const router = express.Router();
const periodFeeController = require('../controllers/periodFeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('Kế toán'));

// Route để lấy và thêm các khoản thu vào một đợt thu cụ thể
router.route('/in-period/:feePeriodId')
  .get(periodFeeController.getFeesInPeriod)
  .post(periodFeeController.addFeeToPeriod);

// Route để sửa và xóa một khoản thu cụ thể
router.route('/:periodFeeId')
  .put(periodFeeController.updateFeeInPeriod)
  .delete(periodFeeController.deleteFeeInPeriod);

module.exports = router;