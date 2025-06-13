const express = require('express');
const router = express.Router();

// Import tất cả các routes
const authRoutes = require('../routes/authRoutes');
const financeRoutes = require('../routes/financeRoutes');
const householdRoutes = require('../routes/householdRoutes');
const residentRoutes = require('../routes/residentRoutes');
const roleRoutes = require('../routes/roleRoutes');
const userRoutes = require('../routes/userRoutes');

// Đăng ký các routes với prefix tương ứng
router.use('/auth', authRoutes);           // /api/auth/*
router.use('/finance', financeRoutes);     // /api/finance/*
router.use('/households', householdRoutes); // /api/households/*
router.use('/residents', residentRoutes);   // /api/residents/*
router.use('/roles', roleRoutes);          // /api/roles/*
router.use('/users', userRoutes);          // /api/users/*

// Route gốc để kiểm tra API
router.get('/', (req, res) => {
  res.json({ 
    message: 'BlueMoon API đang hoạt động!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      finance: '/api/finance',
      households: '/api/households', 
      residents: '/api/residents',
      roles: '/api/roles',
      users: '/api/users'
    }
  });
});

module.exports = router;