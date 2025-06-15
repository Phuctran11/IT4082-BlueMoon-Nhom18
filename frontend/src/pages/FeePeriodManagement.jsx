import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as financeService from '../services/financeService';
import Spinner from '../components/common/Spinner'; // Giả sử bạn có component Spinner
import './FeePeriodManagement.css'; // Sẽ tạo file CSS sau

const FeePeriodManagement = () => {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await financeService.getAllFeePeriods();
        setPeriods(response.data.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách đợt thu:", err);
        setError('Không thể tải dữ liệu từ server.');
      } finally {
        setLoading(false);
      }
    };
    fetchPeriods();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý Đợt thu phí</h1>
        <button className="add-btn">Thêm Đợt thu mới</button> {/* Chức năng này sẽ được làm sau */}
      </div>
      <div className="list-container">
        {periods.length > 0 ? (
          periods.map(period => (
            <div key={period.id} className="list-item-card">
              <div>
                <h3>{period.name}</h3>
                <p className="period-dates">
                  Thời gian: {new Date(period.startDate).toLocaleDateString('vi-VN')} - {new Date(period.endDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <Link to={`/fee-periods/${period.id}`} className="details-btn">
                Xem chi tiết & Lập hóa đơn →
              </Link>
            </div>
          ))
        ) : (
          <p>Chưa có đợt thu phí nào được tạo.</p>
        )}
      </div>
    </div>
  );
};

export default FeePeriodManagement;