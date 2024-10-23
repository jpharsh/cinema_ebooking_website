import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true); 

    const checkSession = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoggedIn(false);
            setIsAdmin(false);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://127.0.0.1:5000/api/check-session', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLoggedIn(response.data.logged_in);

            if (response.data.user_type === 2) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch (error) {
            setLoggedIn(false);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token'); // Clear the token
        setLoggedIn(false); // Update loggedIn state
        setIsAdmin(false);
        window.location.href = '/';
    };

    useEffect(() => {
        checkSession();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ loggedIn, isAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
