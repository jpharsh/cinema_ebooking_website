import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/check-session', { withCredentials: true });
                setLoggedIn(response.data.logged_in);
            } catch (error) {
                console.error("Error checking session:", error);
            }
        };

        checkSession();
    }, [loggedIn]); // Dependency array to recheck session when loggedIn changes

    const handleLogout = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/api/logout');
            setLoggedIn(false);
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <h1>Cinema Movies</h1>
            </div>
            {loggedIn ? (
                <button className="btn black" onClick={handleLogout}>Logout</button>
            ) : (
                <Link to="/login">
                    <button className="btn black">Login</button>
                </Link>
            )}
        </nav>
    );
};

export default Navbar;
