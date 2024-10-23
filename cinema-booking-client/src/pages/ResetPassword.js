import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();  // Corrected: call useNavigate as a function
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const resetToken = query.get('token');  // Extract the reset token from the URL

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
                navigate('/login');  // Corrected: use navigate to redirect
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'An error occurred');
            console.log(resetToken);  // Add this line to check if token is being extracted
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
