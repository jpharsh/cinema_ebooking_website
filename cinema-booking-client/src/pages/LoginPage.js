import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css'; 
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
  
    try {
      console.log("Attempting login with:", { email: trimmedEmail, password: trimmedPassword });  // Debugging info
      const response = await axios.post('http://127.0.0.1:5000/api/login', { email: trimmedEmail, password: trimmedPassword });
      
      const token = response.data.token;  // Retrieve token
      const userType = response.data.user_type; // Retrieve user type (1 = regular user, 2 = admin)

      console.log("Login successful, token:", token, "userType:", userType);  // Debugging info
      localStorage.setItem('token', token);  // Store token in localStorage
      console.log(localStorage.getItem('token'))
      
      if (userType === 2) {
        navigate('/admin-home');  // Redirect admin to AdminHomepage.js
      } else {
        navigate('/');  // Redirect regular user to the homepage
      }
      
      window.location.reload();

    } catch (error) {
      console.error("Error during login:", error);  // Debugging info
      setError('Invalid email or password');
    }
  };

  return (
    <div>
      <div className="login-container">
        <div className="login-right">
          <div className="login-box">
            <h2 className="login-title">Log In</h2>
            <input
              type="text"
              placeholder="Email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="login-btn" onClick={handleLogin}>Log In</button>
            {error && <p className="error-message">{error}</p>}
            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/registration">
                  <button className="link-button">
                    Create Account
                  </button>
                </Link>
              </p>
              <Link to='/forgot-password'>
                <button className="link-button">
                  Forgot Password?
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
