import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './GeneralNavbar.css';
import ProfileIcon from '../images/ProfileIcon.png';

const GeneralNavbar = ({ userRole, onLogout }) => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

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
                <div className="profile-dropdown">
                    <button 
                    className="profile-icon" 
                    onClick={toggleDropdown} 
                    aria-expanded={dropdownOpen}
                    >
                    <img 
                        src={ProfileIcon} 
                        alt="Profile" 
                        className="profile-img"
                    />
                    </button>
                    {dropdownOpen && (
                    <ul className="dropdown-menu">
                        <li><Link to="/edit-profile">Edit Profile</Link></li>
                        <li><Link to="/order-history">View Order History</Link></li>
                        <li onClick={handleLogout}>Logout</li>
                    </ul>
                    )}
                </div>
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
