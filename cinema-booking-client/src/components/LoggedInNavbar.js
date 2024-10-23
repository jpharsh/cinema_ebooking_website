import React from 'react';
import './LoggedInNavbar.css';

const LoggedInNavbar = ({ onLogout }) => {
    const handleLogout = () => {
        // Call the logout function passed from the parent
        onLogout();
    };

    return (
        <nav className="logged-in-navbar">
            <div className="logo">
                <h1>Cinema Movies</h1>
            </div>
            <button className="btn black" onClick={handleLogout}>Log Out</button>
        </nav>
    );
};

export default LoggedInNavbar;
