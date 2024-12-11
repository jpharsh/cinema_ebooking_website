import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResetPassword.css';
import axios from 'axios';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const resetToken = query.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/reset-password', {
                token: resetToken,
                newPassword: newPassword
            });

            if (response.data.message) {
                alert('Password reset successful');
                navigate('/login');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'An error occurred');
            console.log(resetToken);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-box">
                <h2 className="reset-password-title">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>New Password:</label>
                        <input
                            className="input-field"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Confirm Password:</label>
                        <input
                            className="input-field"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {errorMessage && <p className="message">{errorMessage}</p>}
                    <button type="submit" className="login-btn">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
