import React, { useState, useEffect, useCallback } from 'react';
import * as invoiceService from '../services/invoiceService';
import Spinner from '../components/common/Spinner';
import './MyInvoicesPage.css'; // Sẽ tạo file CSS sau

const MyInvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null); // Để xem chi tiết

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await invoiceService.getMyInvoices();
      setInvoices(response.data.data);
    } catch (error) {
      console.error("Lỗi tải hóa đơn:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  if (loading) return <Spinner />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Phí & Hóa đơn của Hộ khẩu</h1>
      </div>
      <div className="invoice-list">
        {invoices.length > 0 ? invoices.map(invoice => (
          <div key={invoice.id} className="invoice-card">
            <div className="invoice-header">
              <h3>{invoice.FeePeriod.name}</h3>
              <span className={`status-badge status-${invoice.status}`}>
                {invoice.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </span>
            </div>
            <div className="invoice-body">
              <p><strong>Tổng tiền:</strong> {Number(invoice.totalAmount).toLocaleString('vi-VN')} đ</p>
              {invoice.paymentDate && (
                <p><strong>Ngày thanh toán:</strong> {new Date(invoice.paymentDate).toLocaleDateString('vi-VN')}</p>
              )}
            </div>
            <div className="invoice-footer">
              <button onClick={() => setSelectedInvoice(invoice)}>Xem chi tiết</button>
            </div>
          </div>
        )) : <p>Bạn chưa có hóa đơn nào.</p>}
      </div>

      {/* MODAL XEM CHI TIẾT HÓA ĐƠN */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết Hóa đơn: {selectedInvoice.FeePeriod.name}</h2>
              <button className="close-btn" onClick={() => setSelectedInvoice(null)}>×</button>
            </div>
            <div className="modal-body">
              <table className="data-table">
                <thead><tr><th>Khoản phí</th><th>Số tiền</th></tr></thead>
                <tbody>
                  {selectedInvoice.InvoiceDetails.map(detail => (
                    <tr key={detail.id}>
                      <td>{detail.FeeType.name}</td>
                      <td>{Number(detail.amount).toLocaleString('vi-VN')} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInvoicesPage;