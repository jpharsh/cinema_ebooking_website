import React, { useState, useEffect } from 'react';
import './OrderHistory.css';
import axios from 'axios';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchUserId() {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
      
      
        if (!token) {
            console.log("No token found, user is not logged in.");
            return null;  // Return null if no token is available
        }
      
      
        try {
            // Make the request with the Authorization header
            const response = await axios.get('http://127.0.0.1:5000/api/check-session', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
      
      
            // Extract only the user_id if the user is logged in
            if (response.data.logged_in) {
                const user_id = response.data.user_id;
                console.log("User ID:", user_id);  // Debugging line
                return user_id;
            } else {
                console.log("User is not logged in.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching user ID:", error);
            return null;
        }
      }

    useEffect(() => {
        // Fetch order history from backend
        const fetchOrders = async () => {
            try {
                const user_id = await fetchUserId();

                const response = await fetch('http://127.0.0.1:5000/api/bookings?user_id=' + user_id);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                console.log(data);
                const formattedOrders = data.map(order => ({
                    id: order.id,
                    movie: order.title,
                    date: order.formatted_date,
                    showtime: order.formatted_time,
                    tickets: {
                        adults: order.adults,
                        children: order.children,
                        seniors: order.seniors,
                    },
                    total: `$${order.total.toFixed(2)}`,
                }));
                setOrders(formattedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="order-history-container">
            <h1 className="page-title">Order History</h1>
            {loading ? (
                <p className="loading">Loading...</p>
            ) : orders.length === 0 ? (
                <p className="no-orders">You have no past orders.</p>
            ) : (
                <div className="order-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <h2 className="movie-title">{order.movie}</h2>
                            <p className="order-details">Date: {order.date}</p>
                            <p className="order-details">Showtime: {order.showtime}</p>
                            <div className="ticket-info">
                                <p className="ticket-type">Adults: {order.tickets.adults}</p>
                                <p className="ticket-type">Children: {order.tickets.children}</p>
                                <p className="ticket-type">Seniors: {order.tickets.seniors}</p>
                            </div>
                            <p className="order-total">Total: {order.total}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
