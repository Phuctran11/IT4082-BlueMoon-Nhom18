const User = require('../models/User'); // Giả sử nhân khẩu là User
const Household = require('../models/Household'); // Giả sử bạn có model Hộ khẩu

// Lấy các chỉ số thống kê chính cho Dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    // Chạy các câu lệnh đếm song song để tăng hiệu suất
    const [residentCount, householdCount] = await Promise.all([
      User.count(), // Đếm tổng số người dùng (coi như dân cư)
      Household.count() // Đếm tổng số hộ khẩu
    ]);

    // Giả lập dữ liệu "Cập nhật gần đây"
    const recentActivities = [
      { id: 1, text: 'Kế toán đã tạo đợt thu phí tháng 6/2025.', time: '1 giờ trước' },
      { id: 2, text: 'Tổ trưởng đã thêm hộ khẩu mới: A-1205.', time: '3 giờ trước' },
    ];

    res.status(200).json({
      success: true,
      data: {
        residentCount,
        householdCount,
        recentActivities,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};