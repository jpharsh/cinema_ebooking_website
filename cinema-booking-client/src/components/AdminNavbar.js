import React from 'react';
import './AdminNavbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Call the logout function passed from the parent
        onLogout();
    };

    const handleLogoClick = () => {
        navigate('/admin-home');
    };
    
    return (
        <nav className="admin-navbar">
            <div className="logo" onClick={handleLogoClick}>
                <h1>Cinema Movies</h1>
            </div>
            <div className="nav-buttons">
                <button className="btn black" onClick={handleLogout}>Log Out</button>
            </div>
        </nav>
    );
};

export default Navbar;