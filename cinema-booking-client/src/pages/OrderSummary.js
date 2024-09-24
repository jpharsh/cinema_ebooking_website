// src/pages/OrderSummary.js

import React from 'react';
import './OrderSummary.css'; // Import the CSS file
// import Header from '../components/Header'; // Import the Header component

const OrderSummary = () => {
  return (
   <div className="summary-container">
      {/* <Header /> */}
      <h1>Order Summary</h1>
      <div className="container2">
      <div className="ticket-details">
        <h3>Ticket Details:</h3>
        <div style={{display: 'flex', flexDirection: 'row' }}>
          <p>2 Adult Tickets: </p>
          <p style={{paddingLeft: '20%'}}>$23.99</p>
        </div>
       
        <div style={{display: 'flex', flexDirection: 'row' }}>
          <p>1 Child Ticket:</p>
          <p style={{paddingLeft: '21.5%'}}>$9.99</p>
        </div>

        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <span style={{alignSelf: 'center'}}><strong>Order Total: </strong></span>
          <p>$33.98</p>
          <button className="edit-button">Edit Tickets</button>  
        </div>
        
        <div></div>

        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <span style={{alignSelf: 'center'}}><strong>Seats: </strong></span> 
          <p style={{paddingLeft: '12%'}}>F6, F7, F8</p>
          <button className="edit-button">Edit Seats</button>
        </div>
        
        <div style={{margin: '40px', paddingLeft: '15%'}}>
          <p></p><button className="cancel-button">Cancel</button>
          <button className="confirm-button">Confirm Payment</button>
        </div>

      </div>
      </div>
    </div>
  );
};

export default OrderSummary;
