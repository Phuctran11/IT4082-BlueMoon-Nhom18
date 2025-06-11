import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as financeService from '../services/financeService';
import Spinner from '../components/common/Spinner';

const FeePeriodDetailPage = () => {
  const { id } = useParams(); // Lấy ID của đợt thu từ URL
  const [period, setPeriod] = useState(null);
  const [feeTypes, setFeeTypes] = useState([]);
  const [selectedFeeType, setSelectedFeeType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy cả thông tin chi tiết đợt thu và danh sách các loại phí
        const periodRes = await financeService.getFeePeriodById(id);
        const feeTypesRes = await financeService.getAllFeeTypes();
        setPeriod(periodRes.data.data);
        setFeeTypes(feeTypesRes.data.data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu trang chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleGenerateInvoices = async () => {
    if (!selectedFeeType) {
      alert('Vui lòng chọn một loại phí!');
      return;
    }
    if (!window.confirm(`Bạn có chắc muốn lập hóa đơn cho loại phí này vào đợt thu "${period.name}"?`)) {
      return;
    }
    try {
      const response = await financeService.generateInvoicesForPeriod(id, selectedFeeType);
      alert(response.data.message);
      // Có thể thêm logic tải lại danh sách hóa đơn ở đây
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Thao tác thất bại.'));
    }
  };

  if (loading) return <Spinner />;
  if (!period) return <div>Không tìm thấy đợt thu phí.</div>;

  return (
    <div className="page-container">
      <h1>Chi tiết Đợt thu: {period.name}</h1>
      <p>Thời gian: {new Date(period.startDate).toLocaleDateString('vi-VN')} - {new Date(period.endDate).toLocaleDateString('vi-VN')}</p>
      <p>Trạng thái: {period.status}</p>

      <div className="action-section">
        <h2>Lập Hóa đơn hàng loạt</h2>
        <div className="invoice-generator">
          <select value={selectedFeeType} onChange={(e) => setSelectedFeeType(e.target.value)}>
            <option value="">-- Chọn loại phí để áp dụng --</option>
            {feeTypes.map(ft => (
              <option key={ft.id} value={ft.id}>{ft.name} ({ft.unit})</option>
            ))}
          </select>
          <button onClick={handleGenerateInvoices} disabled={!selectedFeeType}>
            Bắt đầu Lập hóa đơn
          </button>
        </div>
      </div>
      {/* Thêm phần hiển thị danh sách các hóa đơn đã tạo ở đây */}
    </div>
  );
};

export default FeePeriodDetailPage;