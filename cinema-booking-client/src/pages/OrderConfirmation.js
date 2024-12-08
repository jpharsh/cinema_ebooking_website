import React from 'react';
import { useLocation } from 'react-router-dom';
import './OrderConfirmation.css';


const OrderConfirmation = () => {
 const location = useLocation();
 const { movie, tickets, seats, totalPrice, date, time, adultCount, childCount, seniorCount} = location.state || {};
 return (
   <div>
     <div className="confirmation-container">
       <h1>Order Confirmation</h1>
       <div className="confirmation-card">
         <div className="content-wrapper">
           <img
             src={movie?.poster_url || "https://via.placeholder.com/200"}
             alt={movie?.title || "Movie Poster"}
             className="poster-image"
           />
           <div className="order-details">
             <h2 className="order-movie-title">{movie?.title || "Movie Title"}</h2>
             <p><strong>Time:</strong> {time || "N/A"}</p>
             <p><strong>Tickets:</strong></p>
             <ul style={{ marginLeft: '20px' }}>
               {tickets?.adults > 0 && (
                 <li>
                   {tickets.adults === 1 ? "1 Adult" : `${tickets.adults} Adults`}
                 </li>
               )}
               {tickets?.children > 0 && (
                 <li>
                   {tickets.children === 1 ? "1 Child" : `${tickets.children} Children`}
                 </li>
               )}
               {tickets?.seniors > 0 && (
                 <li>
                   {tickets.seniors === 1 ? "1 Senior" : `${tickets.seniors} Seniors`}
                 </li>
               )}
             </ul>
             <p><strong>Seats:</strong> {seats?.join(', ') || "N/A"}</p>
             <p><strong>Order Total:</strong> ${totalPrice?.toFixed(2) || "0.00"}</p>
           </div>
         </div>
       </div>
       <footer className="footer">Enjoy The Movie!</footer>
     </div>
   </div>
 );
};


export default OrderConfirmation;
