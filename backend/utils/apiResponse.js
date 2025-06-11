const express = require('express');
const router = express.Router();

const householdRoutes = require('./householdRoutes');
const residentRoutes = require('./residentRoutes');
const authRoutes = require('./authRoutes');
const roleRoutes = require('./roleRoutes');
const userRoutes = require('./userRoutes');

router.use('/auth', authRoutes);       // Thêm route đăng nhập
router.use('/households', householdRoutes);
router.use('/residents', residentRoutes);
router.use('/roles', roleRoutes);
router.use('/users', userRoutes);

module.exports = router;
