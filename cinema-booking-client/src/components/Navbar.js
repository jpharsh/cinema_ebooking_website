import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">
                <h1>Cinema Movies</h1>
            </div>
            {/* <ul className="nav-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">Movies</a></li>
                <li><a href="#">About</a></li>
            </ul> */}
            <button className="btn black">Login</button>
        </nav>
    );
};

export default Navbar;
