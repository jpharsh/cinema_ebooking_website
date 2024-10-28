import React from 'react';
import './AdminNavbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/admin-home');
    };
    
    return (
        <nav className="admin-navbar">
            <div>Admin</div>
            <div className="logo" onClick={handleLogoClick}>
                <h1>Cinema Movies</h1>
            </div>
        </nav>
    );
};

export default Navbar;