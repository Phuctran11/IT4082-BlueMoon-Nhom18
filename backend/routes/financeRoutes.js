
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Lấy danh sách tài chính' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Tạo bản ghi tài chính mới' });
});

// Các route khác...

module.exports = router; // ← Quan trọng: export router, không phải object