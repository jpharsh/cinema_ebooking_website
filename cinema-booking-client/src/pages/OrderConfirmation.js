import React from 'react';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  return (
    <div className="confirmation-container">
      {/* <header className="header">
        <span className="cinema-text">Cinema Movies</span>
      </header> */}
      <h1>Order Confirmation</h1>
      <div className="confirmation-card">
        <div className="content-wrapper">
          <img
            src="https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcSK0mRgxk6RD6AXbkAzpQRs7FCh9J0FiOxC9eIHCqoxAgpBeywiPrFjbAcGKbCaVYkc"
            alt="Movie Poster"
            className="poster-image"
          />
          <div className="order-details">
            <h2 className="order-movie-title">Movie Title</h2>
            <p><strong>Date:</strong> Tues, Sept 17, 2024</p>
            <p><strong>Time:</strong> 2:00 PM</p>
            <p><strong>Tickets:</strong> 2 Adults, 1 Child</p>
            <p><strong>Seats:</strong> F6, F7, F8</p>
            <p><strong>Order Total:</strong> $33.97</p>
          </div>
        </div>
      </div>
      <footer className="footer">Enjoy The Movie!</footer>
    </div>
  );
};

export default OrderConfirmation;
