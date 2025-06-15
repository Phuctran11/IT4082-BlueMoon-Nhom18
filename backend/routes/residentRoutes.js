const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Tổ trưởng', 'Tổ phó'));

// Lấy tất cả nhân khẩu của một hộ
router.get('/by-household/:householdId', residentController.getResidentsByHousehold);


// Truy vấn nhân khẩu theo tiêu chí
router.get('/query', residentController.queryResidents);

// Lấy tất cả nhân khẩu
router.get('/', residentController.getAllResidents);

// Lấy thông tin một nhân khẩu theo ID
router.get('/:id', residentController.getResidentById);

// Tạo mới nhân khẩu
router.post('/', residentController.createResident);

// Cập nhật thông tin nhân khẩu
router.put('/:id', residentController.updateResident);

// Xóa nhân khẩu
router.delete('/:id', residentController.deleteResident);

module.exports = router;