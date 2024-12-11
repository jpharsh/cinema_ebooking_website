import React from 'react';
import { useLocation } from 'react-router-dom';
import './OrderSummary.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext'; // Replace with your actual context path

const OrderSummary = () => {
  const location = useLocation();
  const {
    totalPrice,
    movie,
    seats,
    userSeats,
    showid,
    tickets,
    date,
    time,
    selectedCard,
    promoCode
  } = location.state || {};
  const navigate = useNavigate();

  // Fetch user ID based on the stored token
  async function fetchUserId() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("No token found, user is not logged in.");
      return null;  // Return null if no token is available
    }

    try {
      const response = await axios.get('http://127.0.0.1:5000/api/check-session', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

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

  // Fetch promo ID based on promo code
  async function fetchPromoId(promoCode) {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/get-promo-id?promo_code=${promoCode}`);
      return response.data.id; // Assuming the response has the promo ID as 'id'
    } catch (error) {
      console.error("Error fetching promo ID:", error);
      return null; // Return null if promo code is invalid or not found
    }
  }

  // Handle the payment confirmation process
  async function handlePaymentConfirmation() {
    try {
      // Step 1: Update seat statuses
      const response = await fetch('http://127.0.0.1:5000/api/update-seat-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          show_id: showid, // Assuming movie has the show_id
          selectedSeats: userSeats, // An array of selected seat IDs
        }),
      });

      if (!response.ok) {
        alert('Error updating seat statuses.');
        return;
      }

      const user_id = await fetchUserId();  // Retrieve user ID

      if (!user_id) {
        alert('User is not logged in. Please log in to proceed.');
        return;
      }

      // Step 2: Get the promo ID based on the promo code
      const promo_id = promoCode ? await fetchPromoId(promoCode) : null;
      if (!promo_id) {
        console.log("No promo code applied.");
      }

      // Step 3: Save the order in the database
      const userEmail = await getUserEmail(); // Get user email
      const orderData = {
        customer_id: user_id,  
        show_id: showid,         // The show ID
        total: totalPrice,       // Total price of the order
        card_id: selectedCard,   // Payment card ID
        promo_id: promo_id,      // Promo ID if any
      };

      try {
        const orderResponse = await axios.post('http://127.0.0.1:5000/api/save-order', orderData);
        if (orderResponse.status === 200 || orderResponse.status === 201) {
          console.log('Order saved successfully');
        } else {
          console.log(orderResponse.status);
          alert('Error saving the order.');
          return;
        }
      } catch (error) {
        console.error('Error during order saving:', error.response || error.message);
        alert('Error during order saving.');
        return;
      }

      // Step 4: Send confirmation email
      try {
        const emailResponse = await axios.post(
          'http://127.0.0.1:5000/send-confirmation-email',
          {
            to: userEmail,
            movie: movie.title,
            date: date,
            time: time,
            tickets: `${tickets.adults} Adult(s), ${tickets.children} Child(ren), ${tickets.seniors} Senior(s)`,
            total_price: totalPrice.toFixed(2),
            seats: seats,
          }
        );

        if (emailResponse.status === 200) {
          console.log('Email sent successfully');
        } else {
          console.error('Failed to send email:', emailResponse);
        }
      } catch (error) {
        console.error('Error sending email:', error);
      }

      // Step 5: Navigate to the confirmation page
      navigate('/order-confirmation', {
        state: {
          tickets: {
            adults: tickets?.adults || 0,
            children: tickets?.children || 0,
            seniors: tickets?.seniors || 0,
          },
          totalPrice,
          seats,
          date,
          time,
          movie,
        },
      });

    } catch (error) {
      console.error('Error during payment confirmation:', error);
      alert('Error during payment confirmation.');
    }
  }

  // Get user email based on user ID
  async function getUserEmail() {
    const user_id = await fetchUserId();

    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/user-get?id=${user_id}`);
      return response.data.email;
    } catch (error) {
      console.error("Error fetching user email:", error);
      return null;
    }
  }

  return (
    <div>
      <div className="summary-container">
        <h1>Order Summary</h1>
        <div className="container2">
          <div className="ticket-details">
            <h3>Ticket Details:</h3>

            {/* Adult Tickets */}
            {tickets?.adults > 0 && (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <p>
                  {tickets.adults === 1
                    ? "1 Adult Ticket"
                    : `${tickets.adults} Adult Tickets`}:
                </p>
                <p style={{ paddingLeft: '20%' }}>
                  ${(tickets.adults * 11.99).toFixed(2)}
                </p>
              </div>
            )}

            {/* Child Tickets */}
            {tickets?.children > 0 && (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <p>
                  {tickets.children === 1
                    ? "1 Child Ticket"
                    : `${tickets.children} Child Tickets`}:
                </p>
                <p style={{ paddingLeft: '20%' }}>
                  ${(tickets.children * 9.99).toFixed(2)}
                </p>
              </div>
            )}

            {/* Senior Tickets */}
            {tickets?.seniors > 0 && (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <p>
                  {tickets.seniors === 1
                    ? "1 Senior Ticket"
                    : `${tickets.seniors} Senior Tickets`}:
                </p>
                <p style={{ paddingLeft: '20%' }}>
                  ${(tickets.seniors * 10.99).toFixed(2)}
                </p>
              </div>
            )}

            {/* Order Total */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ alignSelf: 'center' }}>
                <strong>Order Total: </strong>
              </span>
              <p>${totalPrice.toFixed(2)}</p>
              <button
                className="edit-button"
                onClick={() => navigate(-2)}
              >
                Edit Tickets
              </button>
            </div>

            {/* Seats */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ alignSelf: 'center' }}>
                <strong>Seats: </strong>
              </span>
              <p style={{ paddingLeft: '12%' }}>{seats?.join(', ')}</p>
              <button
                className="edit-button"
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-3); // Go back one page
                  } else {
                    navigate('/select-seats'); // Fallback to direct route if not in history
                  }
                }}
              >
                Edit Seats
              </button>
            </div>

            <button
              className="confirm-button"
              onClick={handlePaymentConfirmation}
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
