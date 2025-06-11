// THAY ĐỔI Ở ĐÂY: Import tất cả model và cả sequelize từ file index chung
const { sequelize, Household, FeeType, Invoice, InvoiceDetail } = require('../models');

/**
 * Lập hóa đơn hàng loạt cho tất cả các hộ dân trong một đợt thu, dựa trên một loại phí.
 * @param {number} feePeriodId - ID của đợt thu phí
 * @param {number} feeTypeId - ID của loại phí được áp dụng
 */
exports.generateInvoicesForPeriod = async (feePeriodId, feeTypeId) => {
  // Bắt đầu một transaction để đảm bảo toàn vẹn dữ liệu
  const t = await sequelize.transaction();

  try {
    // 1. Lấy thông tin về loại phí được chọn
    const feeType = await FeeType.findByPk(feeTypeId, { transaction: t });
    if (!feeType) {
      throw new Error('Không tìm thấy loại phí này.');
    }

    // 2. Lấy danh sách tất cả các hộ dân đang hoạt động
    const households = await Household.findAll({ where: { status: 'occupied' }, transaction: t });
    if (households.length === 0) {
      throw new Error('Không có hộ dân nào để lập hóa đơn.');
    }

    let invoicesCreatedCount = 0;

    // 3. Lặp qua từng hộ dân để tạo hóa đơn
    for (const household of households) {
      const quantity = 1; 
      const amount = quantity * feeType.price;

      // 4. Tạo hóa đơn (Invoice)
      const newInvoice = await Invoice.create({
        householdId: household.id,
        feePeriodId: feePeriodId,
        totalAmount: amount,
        status: 'unpaid',
        notes: `Hóa đơn tự động cho phí: ${feeType.name}`,
      }, { transaction: t });

      // 5. Tạo chi tiết hóa đơn (InvoiceDetail)
      await InvoiceDetail.create({
        invoiceId: newInvoice.id,
        feeTypeId: feeType.id,
        quantity: quantity,
        priceAtTime: feeType.price,
        amount: amount,
      }, { transaction: t });

      invoicesCreatedCount++;
    }

    // 6. Nếu mọi thứ thành công, commit transaction
    await t.commit();

    return {
      success: true,
      message: `Đã tạo thành công ${invoicesCreatedCount} hóa đơn.`,
    };
  } catch (error) {
    // 7. Nếu có bất kỳ lỗi nào, rollback tất cả thay đổi
    await t.rollback();
    throw new Error(error.message || 'Lỗi không xác định khi tạo hóa đơn.');
  }
};