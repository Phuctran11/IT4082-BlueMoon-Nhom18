import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    // Dummy login logic for now
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1 className="login-title">BlueMoon</h1>
        <div className="input-group">
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="forgot-link-wrapper">
          <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-btn" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Login'}
        </button>
        <button className="register-btn" onClick={handleRegister}>
          Register
        </button>
      </form>
    </div>
  );
};

export default LoginPage;