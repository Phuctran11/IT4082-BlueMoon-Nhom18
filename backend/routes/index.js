const express = require('express');
const router = express.Router();

// Import tất cả các routes
const authRoutes = require('./routes/authRoutes');
const financeRoutes = require('./routes/financeRoutes');
const householdRoutes = require('./routes/householdRoutes');
const residentRoutes = require('./routes/residentRoutes');
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');

// Đăng ký các routes với prefix tương ứng
router.use('/auth', authRoutes);           // /api/auth/*
router.use('/finance', financeRoutes);     // /api/finance/*
router.use('/households', householdRoutes); // /api/households/*
router.use('/residents', residentRoutes);   // /api/residents/*
router.use('/roles', roleRoutes);          // /api/roles/*
router.use('/users', userRoutes);          // /api/users/*



module.exports = router;