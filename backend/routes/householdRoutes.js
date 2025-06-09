
const express = require('express');
const router = express.Router();
const householdController = require('../controllers/householdController');
const { authMiddleware, roleMiddleware } = require('../middleware');
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

// Áp dụng middleware xác thực và phân quyền cho tất cả routes hộ khẩu
router.use(authMiddleware);
router.use(roleMiddleware(['leader']));

// CRUD hộ khẩu
router.get('/', householdController.getAllHouseholds);
router.post('/', householdController.createHousehold);
router.get('/:id', householdController.getHouseholdById);
router.put('/:id', householdController.updateHousehold);
router.delete('/:id', householdController.deleteHousehold);

// Thống kê hộ khẩu với validate query params
router.get('/stats', validateStatsQuery, householdController.getHouseholdStatistics);

module.exports = router;



// Middleware validate tham số truy vấn hộ khẩu (UC010)
const validateSearchQuery = [
  query('householdCode')
    .optional()
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Mã hộ khẩu chỉ chứa chữ và số, không ký tự đặc biệt'),
  query('headOfHousehold')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Tên chủ hộ tối đa 100 ký tự')
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/u)
    .withMessage('Tên chủ hộ không chứa ký tự đặc biệt'),
  query('address')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Địa chỉ tối đa 255 ký tự'),
  query('apartmentType')
    .optional()
    .isIn(['Studio', '1 phòng ngủ', '2 phòng ngủ', '3 phòng ngủ'])
    .withMessage('Loại căn hộ không hợp lệ'),
  query('minMemberCount')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Số thành viên tối thiểu phải là số nguyên dương'),
  query('maxMemberCount')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Số thành viên tối đa phải là số nguyên dương'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Tham số truy vấn không hợp lệ', errors: errors.array() });
    }
    next();
  }
];

// Áp dụng middleware xác thực và phân quyền
router.use(authMiddleware);
router.use(roleMiddleware(['leader', 'subleader'])); // Tổ trưởng/Tổ phó

// Các route CRUD hộ khẩu
router.get('/', householdController.getAllHouseholds);
router.post('/', householdController.createHousehold);
router.get('/:id', householdController.getHouseholdById);
router.put('/:id', householdController.updateHousehold);
router.delete('/:id', householdController.deleteHousehold);

// Route thống kê hộ khẩu
router.get('/stats', householdController.getHouseholdStatistics);

// Route truy vấn hộ khẩu (UC010)
router.get('/search', validateSearchQuery, householdController.searchHouseholds);

module.exports = router;
