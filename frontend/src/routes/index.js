const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const feeTypeRoutes = require('./feeTypeRoutes');
const feePeriodRoutes = require('./feePeriodRoutes');
// const householdRoutes = require('./householdRoutes'); // Sẽ thêm sau

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/fee-types', feeTypeRoutes);
router.use('/fee-periods', feePeriodRoutes);
// router.use('/households', householdRoutes);

module.exports = router;