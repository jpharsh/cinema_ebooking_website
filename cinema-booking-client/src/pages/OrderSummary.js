import React from 'react';
import { useLocation } from 'react-router-dom';
import './OrderSummary.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
// import LoggedInNavbar from '../components/LoggedInNavbar';
// import Header from '../components/Header'; // Import the Header component


const OrderSummary = () => {
 const location = useLocation();
 const {adultCount, childCount, seniorCount, totalPrice, movie, formattedSeats, seats, tickets, finalTotalPrice, date, time } = location.state || {};
 const navigate = useNavigate();


 return (
   <div>
     {/*<LoggedInNavbar />*/}
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
                 {tickets.adults === 1 ? "1 Adult Ticket" : `${tickets.adults} Adult Tickets`}:
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
                 {tickets.children === 1 ? "1 Child Ticket" : `${tickets.children} Child Tickets`}:
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
                 {tickets.seniors === 1 ? "1 Senior Ticket" : `${tickets.seniors} Senior Tickets`}:
               </p>
               <p style={{ paddingLeft: '20%' }}>
                 ${(tickets.seniors * 10.99).toFixed(2)}
               </p>
             </div>
           )}


           {/* Order Total */}
           <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
             <span style={{ alignSelf: 'center' }}>
               <strong>Order Total: </strong>
             </span>
             <p>${totalPrice.toFixed(2)}</p>
             <button className="edit-button"
             on onClick={() => navigate(-2)}
             >
               Edit Tickets</button>
           </div>


           {/* Seats */}
           <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
             <span style={{ alignSelf: 'center' }}>
               <strong>Seats: </strong>
             </span>
             <p style={{ paddingLeft: '12%' }}>
 {seats?.join(', ')} {/* Display seats as a comma-separated list */}
</p>




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
             <p></p>
             <button
         className="order-cancel-button"
         onClick={() => navigate(-1)} // Navigate back to the previous page
       >
         Cancel
       </button>


       <button
 className="confirm-button"
 onClick={async () => {
   const salesTax = totalPrice * 0.07; // Calculate sales tax (7%)
   const onlineFee = 2.0; // Flat online fee
   const finalTotalPrice = totalPrice + salesTax + onlineFee; // Add to total price


   // Send confirmation email
   try {
     const response = await axios.post('http://127.0.0.1:5000/send-confirmation-email', {
       to: 'user@example.com', // Replace with the actual user's email
       movie: movie.title,
       date: date,
       time: time,
       tickets: `${adultCount} Adult(s), ${childCount} Child(ren), ${seniorCount} Senior(s)`,
       total_price: finalTotalPrice.toFixed(2),
     });


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
         adults: tickets?.adults || 0, // Make sure this matches the `Order Summary` ticket logic
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
