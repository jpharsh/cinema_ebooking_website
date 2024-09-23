// src/pages/OrderSummary.js

import React from 'react';
import './OrderSummary.css'; // Import the CSS file
import Header from '../components/Header'; // Import the Header component

const OrderSummary = () => {
  return (
   <div className="order-summary-container">
      <Header />
      <h2 className="order-title">Order Summary</h2>
      <div className="ticket-details">
        <h3>Ticket Details:</h3>
        <p>2 Adult Tickets: $23.99</p>
        <p>1 Child Ticket: $9.99</p>

        <span><strong>Order Total: $33.98</strong></span>
        <button className="edit-button">Edit Tickets</button>     
<div></div>
           <span><strong>Seats:</strong> F6, F7, F8</span> 
        <button className="edit-button">Edit Seats</button>
        
        <p></p><button className="cancel-button">Cancel</button>
        <button className="confirm-button">Confirm Payment</button>
      </div>
    </div>
  );
};

export default OrderSummary;
