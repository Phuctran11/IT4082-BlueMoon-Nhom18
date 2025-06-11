const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { body, validationResult } = require('express-validator');

const validateResident = [
  // ... (giữ nguyên validate như bạn có)
];

// Áp dụng middleware xác thực và phân quyền
router.use(authMiddleware);
router.use(roleMiddleware(['Tổ trưởng', 'Tổ phó'])); // Sửa role chuẩn

// Các route
router.get('/household/:householdId', residentController.getResidentsByHousehold);
router.post('/', validateResident, residentController.createResident);
router.put('/:id', validateResident, residentController.updateResident);
router.delete('/:id', residentController.deleteResident);
router.get('/statistics', residentController.statisticsResidents);
router.get('/query', residentController.queryResidents);

module.exports = router;
