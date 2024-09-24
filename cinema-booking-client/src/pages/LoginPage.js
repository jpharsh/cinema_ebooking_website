// src/pages/LoginPage.js

import React from 'react';
import './LoginPage.css'; // Ensure the styles are imported
import popcorn from '../images/popcorn.jpg'; 
import Navbar from '../components/Navbar';
// import Header from '../components/Header'; // Import the Header component

const LoginPage = () => {
  return (
    <div>
      <Navbar />
      <div className="login-container">
        {/* <Header /> This line adds the Header component here */}
        <div className="login-left">
          <img
            src={popcorn}
            alt="Theater"
            className="theater-img"
          />
        </div>
        <div className="login-right">
          <div className="login-box">
            <h2 className="login-title">Log In</h2>
            <input type="text" placeholder="Username" className="input-field" />
            <input type="password" placeholder="Password" className="input-field" />
            <button className="login-btn">Log In</button>
            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <button className="link-button" onClick={() => alert('Create Account clicked')}>
                  Create Account
                </button>
              </p>
              <button className="link-button" onClick={() => alert('Forgot Password clicked')}>
                Forgot Password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
