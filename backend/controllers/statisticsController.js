const { Household, sequelize, Resident } = require('../models');
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




// Hàm tính tuổi
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Hàm nhóm tuổi
function getAgeGroup(age) {
  if (age < 18) return '<18';
  if (age <= 35) return '18-35';
  if (age <= 60) return '36-60';
  return '>60';
}

/**
 * Thống kê nhân khẩu (theo block, floor, gender, ageGroup)
 */
exports.getResidentStats = async (req, res) => {
  try {
    const { block, floor, gender, ageGroup } = req.query;

    const householdWhere = {};
    if (block) householdWhere.block = block;
    if (floor) householdWhere.floor = floor;

    const households = await Household.findAll({
      where: householdWhere,
      attributes: ['id'],
      raw: true,
    });

    if (households.length === 0) {
      return res.json({ success: true, data: [], message: 'Không có kết quả phù hợp' });
    }

    const householdIds = households.map(h => h.id);

    let residents = await Resident.findAll({
      where: {
        householdId: { [Op.in]: householdIds },
      },
      attributes: ['dateOfBirth', 'gender', 'fullName'],
      raw: true,
    });

    if (residents.length === 0) {
      return res.json({ success: true, data: [], message: 'Không có kết quả phù hợp' });
    }

    if (gender) {
      residents = residents.filter(r => r.gender === gender);
    }

    residents = residents.map(r => {
      const age = calculateAge(r.dateOfBirth);
      return {
        ...r,
        age,
        ageGroup: getAgeGroup(age),
      };
    });

    if (ageGroup) {
      residents = residents.filter(r => r.ageGroup === ageGroup);
    }

    if (residents.length === 0) {
      return res.json({ success: true, data: [], message: 'Không có kết quả phù hợp' });
    }

    const totalResidents = residents.length;

    const countByAgeGroup = residents.reduce((acc, r) => {
      acc[r.ageGroup] = (acc[r.ageGroup] || 0) + 1;
      return acc;
    }, {});

    const countByGender = residents.reduce((acc, r) => {
      acc[r.gender] = (acc[r.gender] || 0) + 1;
      return acc;
    }, {});

    const result = {
      totalResidents,
      countByAgeGroup,
      countByGender,
      criteria: { block, floor, gender, ageGroup },
    };

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi thống kê nhân khẩu: ' + error.message });
  }
};