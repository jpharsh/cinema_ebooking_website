import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoggedInNavbar.css';

const LoggedInNavbar = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Call the logout function passed from the parent
        onLogout();
    };

    const handleEditProfile = () => {
        // Navigate to the edit profile page
        navigate('/edit-profile');
    };

    const handleLogoClick = () => {
        navigate('/'); // Navigate to the homepage
    };

    return (
        <nav className="logged-in-navbar">
            <div className="logo" onClick={handleLogoClick}>
                <h1>Cinema Movies</h1>
            </div>
            <div className="nav-buttons">
                <button className="btn black" onClick={handleEditProfile}>Edit Profile</button>
                <button className="btn black" onClick={handleLogout}>Log Out</button>
            </div>
        </nav>
    );
};

export default LoggedInNavbar;
