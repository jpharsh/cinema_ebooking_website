import React from 'react';
import './PaymentInfo.css';
import MasterCardLogo from '../images/MasterCardLogo.png';
import VisaLogo from '../images/VisaLogo.png';
// import LoggedInNavbar from '../components/LoggedInNavbar';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalPrice, movie, formattedSeats } = location.state || {};
//   const seats = formattedSeats.map(seat => `Row ${seat.row + 1}, Seat ${seat.col + 1}`);
  const seats = formattedSeats.map(seat => {
    const rowLetter = String.fromCharCode(65 + seat.row); // Convert row index to letter (A = 65 in ASCII)
    const seatNumber = seat.col + 1; 
    return `${rowLetter}${seatNumber}`;
});
  const date = location.state?.date;
  const time = location.state?.time;

   if (!totalPrice) {
    return <p>No price available</p>;
   }

  return (
    <div>
        {/*<LoggedInNavbar />*/}
    <div className="movie-section" style={{ width: '50%', alignContent: 'center', padding: '30px'}}>
        <h2 style={{ marginTop: '0px', textAlign: 'left' }}>Payment Info</h2>
        <div className="saved-cards-container">
            <div className="first-row">
                <h3>Select Saved Card</h3>
                <p className="small-text">Name</p>
                <p className="small-text">Expiration Date</p>
            </div>
            
            <button className="card">
                <div className="card-info">
                    <div className="card-type">
                        <img src={MasterCardLogo} alt="MasterCard Logo" className="card-logo" />
                        <h4>MasterCard</h4>
                        <p className="small-text">ending in 7890</p>
                    </div>
                    
                    <p style={{ paddingRight: '95px' }}> John Smith</p>
                    <p style={{ paddingRight: '20px' }}> 10/26</p>
                   
                </div>
            </button>
            <button className="card">
                <div className="card-info">
                    <div className="card-type">
                        <img src={VisaLogo} alt="Visa Logo" className="card-logo" />
                        <h4>Visa</h4>
                        <p className="small-text">ending in 2345</p>
                    </div>
                    <p style={{ paddingRight: '45px' }}> John Smith</p>
                    <p style={{ paddingRight: '25px' }}> 5/27</p>
                </div>
            </button>
        </div>
        <h3 style={{ paddingTop: '20px' }}>Enter Payment Info</h3>
        <div className="payment-info-container">
            <div className="payment-info">
                <label>Name on Card</label>
                <input className="input-box" style={{ width: '230px' }} type="text" />
            </div>
            <div className="payment-info">
                <label>Card Number</label>
                <input className="input-box" style={{ width: '260px' }} type="text" />
            </div>
            <div className="payment-info">
                <label>Expiration Date</label>
                <input className="input-box" style={{ width: '110px' }} type="text" />
            </div>
            <div className="payment-info">
                <label>CVV/CVC</label>
                <input className="input-box" style={{ width: '50px' }} type="text" />
            </div>
        </div>
        <h3 style={{ paddingTop: '20px' }}>Enter Billing Address</h3>
        <div className="payment-info-container">
            <div className="payment-info">
                <label>Street Address</label>
                <input className="input-box" style={{ width: '280px' }} type="text" />
            </div>
            <div className="payment-info">
                <label>City</label>
                <input className="input-box" style={{ width: '210px' }} type="text" />
            </div>
            <div className="payment-info">
                <label>State</label>
                <input className="input-box" style={{ width: '70px' }} type="text" />
            </div>
            <div className="payment-info">
                <label>Zip Code</label>
                <input className="input-box" style={{ width: '90px' }} type="text" />
            </div>
        </div>
        <button className="red btn" style={{ marginTop: '20px', display: 'flex', alignSelf: 'flex-start'}}>Add Your Card</button>
        <h3 style={{ paddingTop: '30px' }}>Enter Promo Codes</h3>
        <div className="payment-info" style={{ marginTop: '20px', gap: '10px' }}>
            <div>
                <label>Promo Code </label>
                <span className="small-text">(optional)</span>
            </div>
            
            <input className="input-box" style={{ width: '150px' }} type="text" />
            <div style={{ width: '97%', display: 'flex', justifyContent: 'space-between'}}>
                <button className="red btn">Apply Promo</button>
                <label>Total: ${totalPrice}</label>
            </div>
        </div>
        <div className="btn-container">
            <button className="btn white">Cancel</button>
            <button className="btn red">Continue to Checkout</button>
        </div>

        {/* remove this: (this was just to see what info is passing to order summary page) */}
        {movie.title}
        <div>
            <h3>Selected Seats:</h3>
            <ul>
                {seats.map((seat, index) => (
                    <li key={index}>{seat}</li> // Each seat is rendered as a list item
                ))}
            </ul>
            <p>Date: {date}</p>
            <p>Time: {time}</p>
        </div>

        </div>
    </div>
  );
};

export default PaymentInfo;
