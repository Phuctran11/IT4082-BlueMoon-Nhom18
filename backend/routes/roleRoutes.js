const express = require('express');
const router = express.Router();

const roleController = require('../controllers/roleController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Danh sách vai trò - chỉ Tổ trưởng/Tổ phó mới được xem
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['Tổ trưởng', 'Tổ phó']),
  roleController.getAllRoles
);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['Tổ trưởng', 'Tổ phó']),
  roleController.createRole
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['Tổ trưởng', 'Tổ phó']),
  roleController.updateRole
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['Tổ trưởng', 'Tổ phó']),
  roleController.deleteRole
);

module.exports = router;
