const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Chỉ cho phép Tổ trưởng, Tổ phó phân quyền
router.put('/assign-role', authMiddleware, roleMiddleware(['Tổ trưởng', 'Tổ phó']), userController.assignRole);

module.exports = router;
