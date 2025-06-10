const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Route này sẽ được bảo vệ bởi middleware sau này
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;