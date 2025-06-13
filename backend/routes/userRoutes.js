const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.put(
  '/assign-role',
  authMiddleware,
  roleMiddleware(['Tổ trưởng', 'Tổ phó', 'Admin']),
  userController.assignRole
);

module.exports = router;
