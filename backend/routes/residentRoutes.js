const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const { authMiddleware, roleMiddleware } = require('../middleware');
const { body, validationResult } = require('express-validator');

// Middleware validate dữ liệu nhân khẩu
const validateResident = [
  body('householdId').isInt().withMessage('householdId phải là số nguyên'),
  body('fullName')
    .isLength({ min: 1, max: 100 }).withMessage('Họ tên phải từ 1 đến 100 ký tự')
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/u).withMessage('Họ tên không chứa ký tự đặc biệt'),
  body('birthDate')
    .matches(/^\d{2}\/\d{2}\/\d{4}$/).withMessage('Ngày sinh phải đúng định dạng dd/mm/yyyy')
    .custom(value => {
      const parts = value.split('/');
      const date = new Date(parts[2], parts[1] - 1, parts[0]);
      if (date > new Date()) {
        throw new Error('Ngày sinh không được lớn hơn ngày hiện tại');
      }
      return true;
    }),
  body('gender').isIn(['Nam', 'Nữ', 'Khác']).withMessage('Giới tính không hợp lệ'),
  body('cccd')
    .isLength({ min: 12, max: 12 }).withMessage('Số CCCD phải đủ 12 chữ số')
    .isNumeric().withMessage('Số CCCD chỉ chứa chữ số'),
  body('relationToHead').isIn(['Chủ hộ', 'vợ', 'chồng', 'con', 'khác']).withMessage('Quan hệ với chủ hộ không hợp lệ'),
  body('occupation')
    .optional()
    .isLength({ max: 100 }).withMessage('Nghề nghiệp tối đa 100 ký tự'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors: errors.array() });
    }
    next();
  }
];

// Áp dụng middleware xác thực và phân quyền
router.use(authMiddleware);
router.use(roleMiddleware(['leader', 'subleader'])); // Tổ trưởng/Tổ phó

// Lấy danh sách nhân khẩu theo hộ khẩu
router.get('/household/:householdId', residentController.getResidentsByHousehold);

// Tạo mới nhân khẩu
router.post('/', validateResident, residentController.createResident);

// Cập nhật nhân khẩu
router.put('/:id', validateResident, residentController.updateResident);

// Xóa nhân khẩu
router.delete('/:id', residentController.deleteResident);

// Route thống kê nhân khẩu
router.get('/statistics', residentController.statisticsResidents);

module.exports = router;
