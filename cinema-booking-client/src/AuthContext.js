import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); 

    const checkSession = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoggedIn(false);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://127.0.0.1:5000/api/check-session', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLoggedIn(response.data.logged_in);
        } catch (error) {
            setLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token'); // Clear the token
        setLoggedIn(false); // Update loggedIn state
        window.location.reload();
    };

    useEffect(() => {
        checkSession();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ loggedIn, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
