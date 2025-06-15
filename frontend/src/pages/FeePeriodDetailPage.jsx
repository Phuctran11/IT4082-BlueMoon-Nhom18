import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as financeService from '../services/financeService';
import Spinner from '../components/common/Spinner';
import './FeePeriodDetailPage.css'; // Sẽ tạo file CSS sau

const FeePeriodDetailPage = () => {
  const { id } = useParams(); // Lấy ID của đợt thu từ URL
  const [period, setPeriod] = useState(null);
  const [feeTypes, setFeeTypes] = useState([]);
  const [selectedFeeType, setSelectedFeeType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [periodRes, feeTypesRes] = await Promise.all([
          financeService.getFeePeriodById(id),
          financeService.getAllFeeTypes()
        ]);
        setPeriod(periodRes.data.data);
        setFeeTypes(feeTypesRes.data.data);
      } catch (err) {
        console.error("Lỗi tải dữ liệu trang chi tiết:", err);
        setError('Không thể tải được dữ liệu cần thiết.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleGenerateInvoices = async () => {
    if (!selectedFeeType) {
      alert('Vui lòng chọn một loại phí để áp dụng!');
      return;
    }
    if (!window.confirm(`Bạn có chắc muốn lập hóa đơn cho loại phí này vào đợt thu "${period.name}"? Thao tác này không thể hoàn tác.`)) {
      return;
    }
    try {
      const response = await financeService.generateInvoicesForPeriod(id, selectedFeeType);
      alert(response.data.message);
      // TODO: Thêm logic tải lại danh sách hóa đơn của đợt thu này ở đây
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || 'Thao tác thất bại.'));
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!period) return <div>Không tìm thấy thông tin đợt thu phí.</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Chi tiết Đợt thu: {period.name}</h1>
      </div>
      
      <div className="info-card">
        <p><strong>Từ ngày:</strong> {new Date(period.startDate).toLocaleDateString('vi-VN')}</p>
        <p><strong>Đến ngày:</strong> {new Date(period.endDate).toLocaleDateString('vi-VN')}</p>
      </div>

      <div className="action-card">
        <h2>Lập Hóa đơn hàng loạt</h2>
        <p>Chọn một loại phí dưới đây để tự động tạo hóa đơn cho tất cả các hộ dân trong đợt thu này.</p>
        <div className="invoice-generator-form">
          <select value={selectedFeeType} onChange={(e) => setSelectedFeeType(e.target.value)}>
            <option value="" disabled>-- Vui lòng chọn loại phí --</option>
            {feeTypes.map(ft => (
              <option key={ft.id} value={ft.id}>
                {ft.name} ({Number(ft.price).toLocaleString('vi-VN')} đ / {ft.unit})
              </option>
            ))}
          </select>
          <button onClick={handleGenerateInvoices} disabled={!selectedFeeType} className="generate-btn">
            Tạo Hóa đơn
          </button>
        </div>
      </div>
      
      <div className="invoice-list-section">
        <h2>Danh sách hóa đơn đã được tạo trong đợt này</h2>
        <p>Chức năng đang được phát triển...</p>
        {/* Phần này sẽ hiển thị danh sách các hóa đơn đã được tạo */}
      </div>
    </div>
  );
};

export default FeePeriodDetailPage;