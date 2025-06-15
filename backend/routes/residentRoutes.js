const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Tổ trưởng', 'Tổ phó'));

// Ví dụ: Lấy tất cả nhân khẩu của một hộ
// GET /api/residents/by-household/1
router.get('/by-household/:householdId', residentController.getResidentsByHousehold);

module.exports = router;
