// src/pages/OrderSummary.js


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
 } = location.state || {};
 const navigate = useNavigate();
//  const { user } = useContext(AuthContext); // Assume user contains email and other user details
// const userEmail = user?.email; // Get the log

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
     {/* <LoggedInNavbar /> */}
     <div className="summary-container">
       {/* <Header /> */}
       <h1>Order Summary</h1>
       <div className="container2">
         <div className="ticket-details">
           <h3>Ticket Details:</h3>


           {/* Adult Tickets */}
           {tickets?.adults > 0 && (
             <div style={{ display: 'flex', flexDirection: 'row' }}>
               <p>
                 {/* {tickets.adults === 1
                   ? "1 Adult Ticket"
                   : `${tickets.adults} Adult Tickets`}: */}
                  {tickets.adults} Adult Ticket(s):
               </p>
               <p style={{ paddingLeft: '13.5%' }}>
                 ${(tickets.adults * 11.99).toFixed(2)}
               </p>
             </div>
           )}


           {/* Child Tickets */}
           {tickets?.children > 0 && (
             <div style={{ display: 'flex', flexDirection: 'row' }}>
               <p>
                 {/* {tickets.children === 1
                   ? "1 Child Ticket"
                   : `${tickets.children} Child Tickets`}: */}
                  {tickets.children} Child Ticket(s):
               </p>
               <p style={{ paddingLeft: '13.5%' }}>
                 ${(tickets.children * 9.99).toFixed(2)}
               </p>
             </div>
           )}


           {/* Senior Tickets */}
           {tickets?.seniors > 0 && (
             <div style={{ display: 'flex', flexDirection: 'row' }}>
               <p>
                 {/* {tickets.seniors === 1
                   ? "1 Senior Ticket"
                   : `${tickets.seniors} Senior Tickets`}: */}
                  {tickets.seniors} Senior Ticket(s):
               </p>
               <p style={{ paddingLeft: '13.5%' }}>
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
             <p style={{marginTop: '15px'}}>${totalPrice.toFixed(2)}</p>
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
             <p style={{ paddingLeft: '15%', marginTop: '15px' }}>{seats?.join(', ')}</p>
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


           {/* Confirm and Cancel Buttons */}
           <div style={{ margin: '40px', paddingLeft: '15%' }}>
             <button
               className="order-cancel-button"
               onClick={() => navigate(-1)} // Navigate back to the previous page
             >
               Cancel
             </button>


             <button
               className="confirm-button"
               onClick={async () => {

                // book the tickets
                try {
                  // Make an API call to update the seat statuses to 2 for the specific show_id
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
                      // Handle failure response
                      alert('Error updating seat statuses.');
                  }
                } catch (error) {
                    console.error('Error updating seat statuses:', error);
                    alert('Error updating seat statuses.');
                }

                 // Send confirmation email
                 try {
                  const userEmail = await getUserEmail();
                   const response = await axios.post(
                     'http://127.0.0.1:5000/send-confirmation-email',
                     {
                       to: userEmail, // Replace with the actual user's email
                       movie: movie.title,
                       date: date,
                       time: time,
                       tickets: `${tickets.adults} Adult(s), ${tickets.children} Child(ren), ${tickets.seniors} Senior(s)`,
                       total_price: totalPrice.toFixed(2),
                       seats: seats,
                     }
                   );


                   if (response.status === 200) {
                     console.log('Email sent successfully');
                   } else {
                     console.error('Failed to send email:', response);
                   }
                 } catch (error) {
                   console.error('Error sending email:', error);
                 }


                 // Navigate to confirmation page
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
               }}
             >
               Confirm Payment
             </button>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};


export default OrderSummary;