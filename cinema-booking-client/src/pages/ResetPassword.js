import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams to get the token
import './ResetPassword.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams(); // Get the search params from the URL
  const token = searchParams.get('token'); // Extract the token

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('/api/reset-password', { token, newPassword });
      setMessage(response.data.message);
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Error resetting password.');
      setMessage('');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2 className="reset-password-title">Reset Password</h2>
        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New Password"
            className="input-field"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="input-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
