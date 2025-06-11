const express = require('express');
const router = express.Router();
const householdController = require('../controllers/householdController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { query, validationResult } = require('express-validator');

// Middleware validate tham số truy vấn thống kê
const validateStatsQuery = [
  query('address').optional().isString().withMessage('Địa chỉ phải là chuỗi'),
  query('apartmentType').optional().isIn(['Studio', '1 phòng ngủ', '2 phòng ngủ', '3 phòng ngủ', 'Penhouse']).withMessage('Loại căn hộ không hợp lệ'),
  query('minMemberCount').optional().isInt({ min: 1 }).withMessage('Số thành viên tối thiểu phải là số nguyên dương'),
  query('maxMemberCount').optional().isInt({ min: 1 }).withMessage('Số thành viên tối đa phải là số nguyên dương'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Tham số không hợp lệ', errors: errors.array() });
    }
    next();
  }
];

// Áp dụng middleware xác thực và phân quyền
router.use(authMiddleware);
router.use(roleMiddleware(['Tổ trưởng', 'Tổ phó'])); // sửa role thành đúng tên

// CRUD hộ khẩu
router.get('/', householdController.getAllHouseholds);
router.post('/', householdController.createHousehold);
router.get('/:id', householdController.getHouseholdById);
router.put('/:id', householdController.updateHousehold);
router.delete('/:id', householdController.deleteHousehold);

// Thống kê hộ khẩu với validate query params
router.get('/stats', validateStatsQuery, householdController.getHouseholdStatistics);

module.exports = router;
