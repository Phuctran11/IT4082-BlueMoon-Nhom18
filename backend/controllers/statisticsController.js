const { Household, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Thống kê Hộ khẩu theo các tiêu chí lọc.
 */
exports.getHouseholdStats = async (req, res) => {
  try {
    // Lấy các tham số lọc từ URL, ví dụ: /statistics/households?area=Block A&apartmentType=2 phòng ngủ
    const { area, apartmentType } = req.query;

    // 1. Xây dựng điều kiện lọc (WHERE clause) một cách linh hoạt
    const whereClause = {};

    if (area) {
      // Tìm kiếm không phân biệt hoa thường trong cả mã căn hộ và địa chỉ
      whereClause[Op.or] = [
        { apartmentCode: { [Op.iLike]: `%${area}%` } },
        { address: { [Op.iLike]: `%${area}%` } }
      ];
    }
    if (apartmentType) {
      whereClause.apartmentType = apartmentType;
    }

    // 2. Thực hiện truy vấn để lấy danh sách chi tiết các hộ khẩu khớp điều kiện
    const filteredHouseholds = await Household.findAll({
      where: whereClause,
      order: [['apartmentCode', 'ASC']]
    });

    // 3. Từ danh sách đã lọc, tính toán các con số thống kê tổng hợp
    const householdCount = filteredHouseholds.length;
    const totalMemberCount = filteredHouseholds.reduce((sum, household) => {
      return sum + (Number(household.memberCount) || 0);
    }, 0);

    // 4. Trả về một object JSON chứa cả dữ liệu tổng hợp và dữ liệu chi tiết
    res.status(200).json({
      success: true,
      summary: {
        householdCount,
        totalMemberCount
      },
      data: filteredHouseholds 
    });

  } catch (error) {
    console.error("LỖI KHI THỐNG KÊ HỘ KHẨU:", error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};