// validateRequest.js
const { validationResult } = require('express-validator');

/**
 * Middleware dùng để kiểm tra kết quả validate của express-validator.
 * Nếu có lỗi validate, trả về lỗi 400 với danh sách lỗi.
 * Nếu không có lỗi, tiếp tục next middleware/controller.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Tham số không hợp lệ',
      errors: errors.array()
    });
  }
  next();
};

module.exports = validateRequest;
