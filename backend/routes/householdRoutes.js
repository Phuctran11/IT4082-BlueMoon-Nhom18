const express = require('express');
const router = express.Router();
const householdController = require('../controllers/householdController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Tất cả các route dưới đây đều yêu cầu phải đăng nhập
router.use(protect);

// Chỉ Tổ trưởng và Tổ phó mới có quyền quản lý hộ khẩu
router.route('/')
  .get(authorize('Tổ trưởng', 'Tổ phó'), householdController.getAllHouseholds)
  .post(authorize('Tổ trưởng', 'Tổ phó'), householdController.createHousehold);

router.route('/:id')
  .put(authorize('Tổ trưởng', 'Tổ phó'), householdController.updateHousehold)
  .delete(authorize('Tổ trưởng', 'Tổ phó'), householdController.deleteHousehold);

module.exports = router;
