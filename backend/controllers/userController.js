const { User, Role } = require('../models');

// GET all users
exports.getAllUsers = async (req, res) => {
  // Viết logic ở đây
  res.status(200).json({ message: 'Chức năng lấy tất cả người dùng' });
};

// CREATE a new user (khác với register, chức năng này do admin tạo)
exports.createUser = async (req, res) => {
  // Viết logic ở đây
  res.status(201).json({ message: 'Chức năng tạo người dùng mới' });
};

// Thêm các hàm khác: getUserById, updateUser, deleteUser...