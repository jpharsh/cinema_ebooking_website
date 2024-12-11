import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GeneralNavbar.css';

const GeneralNavbar = ({ userRole, onLogout }) => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        if (userRole === 'admin') {
            navigate('/admin-home');
        } else {
            navigate('/');
        }
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    const handleLogout = () => {
        onLogout();
    };

    const renderButtons = () => {
        if (userRole === 'admin') {
            return <button className="btn black" onClick={handleLogout}>Log Out</button>;
        } else if (userRole === 'user') {
            return (
                <>
                    <button className="btn black" onClick={handleEditProfile}>Edit Profile</button>
                    <button className="btn black" onClick={handleLogout}>Log Out</button>
                </>
            );
        } else {
            return (
                <button className="btn black" onClick={() => navigate('/login')}>Login</button>
            );
        }
    };

    return (
        <nav className="general-navbar">
            <div className="logo" onClick={handleLogoClick}>
                <h1>Cinema Movies</h1>
            </div>
            <div className="nav-buttons">
                {renderButtons()}
            </div>
        </nav>
    );
};

export default GeneralNavbar;
