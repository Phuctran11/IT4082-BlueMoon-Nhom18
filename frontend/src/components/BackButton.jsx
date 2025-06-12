import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button className="back-btn" onClick={() => navigate(-1)}>
      <span className="back-icon">←</span>
      <span>Quay lại</span>
    </button>
  );
};

export default BackButton; 