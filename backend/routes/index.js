const express = require('express');
const router = express.Router();


const dashboardRoutes = require('./dashboardRoutes'); 
const authRoutes = require('./authRoutes');
// const userRoutes = require('./userRoutes');
// Import các file route khác...
const financeRoutes = require('./financeRoutes');
// const householdRoutes = require('./householdRoutes');

router.use('/auth', authRoutes);
router.use('/fee-types', financeRoutes);
router.use('/dashboard', dashboardRoutes);
// router.use('/users', userRoutes);
// ...

module.exports = router;