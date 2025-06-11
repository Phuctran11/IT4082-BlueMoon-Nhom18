const express = require('express');
const router = express.Router();

// Import các file route của bạn
const authRoutes = require('./authRoutes');
const feeTypeRoutes = require('./feeTypeRoutes');
const feePeriodRoutes = require('./feePeriodRoutes');
const dashboardRoutes = require('./dashboardRoutes');
// Thêm các file routes khác mà bạn đã tạo code khung ở đây
// const householdRoutes = require('./householdRoutes');
// const userRoutes = require('./userRoutes');

// Gán các route vào đường dẫn tương ứng
router.use('/auth', authRoutes);
router.use('/fee-periods', feePeriodRoutes); // Route cho kỳ thu phí
router.use('/fee-types', feeTypeRoutes); // Route cho loại phí (có thể gộp chung với financeRoutes nếu cần)
router.use('/dashboard', dashboardRoutes); // Route cho dashboard
// router.use('/households', householdRoutes);
// router.use('/users', userRoutes);

// Export router chính để server.js có thể sử dụng
module.exports = router;