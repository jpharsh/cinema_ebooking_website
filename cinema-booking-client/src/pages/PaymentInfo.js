import React from 'react';
import './PaymentInfo.css';
import MasterCardLogo from '../images/MasterCardLogo.png';
import VisaLogo from '../images/VisaLogo.png';
import AmexLogo from '../images/AmericanExpressLogo.png';
import DiscoverLogo from '../images/DiscoverLogo.png';
import DefaultCardLogo from '../images/DefaultCardLogo.png';
// import LoggedInNavbar from '../components/LoggedInNavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [cards, setCards] = useState([]);
  useEffect(() => {
    // Fetch saved cards from the backend
    const fetchCards = async () => {
        const userId = await fetchUserId();

        if (!userId) {
            console.error("User is not logged in or session is invalid.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            // Fetch card information
            const cardResponse = await axios.get(`http://127.0.0.1:5000/api/cards-get?user_id=${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const cardData = cardResponse.data;
            console.log('Card data:', cardData);
            if (cardData.found) {
                setCards(cardData.card_data.map(card => ({
                    id: card.id,
                    nameOnCard: card.name_on_card,
                    cardNumber: card.card_num,
                    expirationMonth: card.exp_month,
                    expirationYear: card.exp_year,
                    cvc: card.cv_num,
                    streetAddress: card.street_address,
                    city: card.city,
                    state: card.state,
                    zipCode: card.zip_code
                })));
            }
        } catch (error) {
            console.error('Error fetching payment cards:', error);
        }
    };

    fetchCards();
}, []);
  const [selectedCard, setSelectedCard] = useState(null)

   if (!totalPrice) {
    return <p>No price available</p>;
   }


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

  return (
    <div>
        {/*<LoggedInNavbar />*/}
    <div className="movie-section" style={{ width: '50%', alignContent: 'center', padding: '30px'}}>
        <h2 style={{ marginTop: '0px', textAlign: 'left' }}>Payment Info</h2>
        {/* only render saved cards container if there are saved cards  */}
        {cards.length > 0 && (
        <div className="saved-cards-container">
            <div className="first-row">
                <h3>Select Saved Card</h3>
                <p className="small-text" style={{paddingLeft: '13%'}}>Name</p>
                <p className="small-text">Expiration Date</p>
            </div>
            
            <div className="card-rows">
            {cards.map(card => (
            <button 
                key={card.id}
                className="card"
                onClick={() => setSelectedCard(card.id)} // Update selected card
                style={{
                    backgroundColor: selectedCard === card.id ? '#555' : '#353535',
                }}
            >
                <div className="card-info">
                    <div className="card-type" style={{width: '31%'}}>
                        {/* starts with 4 = visa, starts with 2 or 5 = mastercard, starts with 3 = amex, starts with 6 = discover, else default */}
                        
                        {card.cardNumber.toString().startsWith('4') ? (
                            <div className="card-type">
                                <img src={VisaLogo} alt="Visa Logo" className="card-logo" />
                                <h4>Visa</h4>
                            </div>
                        ) : card.cardNumber.toString().startsWith('5') || card.cardNumber.toString().startsWith('2') ? (
                            <div className="card-type">
                                <img src={MasterCardLogo} alt="MasterCard Logo" className="card-logo" />
                                <h4>MasterCard</h4>
                            </div>
                        ) : card.cardNumber.toString().startsWith('3') ? (
                            <div className="card-type">
                                <img src={AmexLogo} alt="Amex Logo" className="card-logo" />
                                <h4>Amex</h4>
                            </div>
                        ) : card.cardNumber.toString().startsWith('6') ? (
                            <div className="card-type">
                                <img src={DiscoverLogo} alt="Discover Logo" className="card-logo" />
                                <h4>Discover</h4>
                            </div>
                        ) : (
                            <div className="card-type">
                                <img src={DefaultCardLogo} alt="Default Card Logo" className="card-logo" />
                                <h4>Card</h4>
                            </div>
                        )}   
                        
                        {/* <h4>{card.cardNumber.toString().startsWith('4') ? 'Visa' : 'MasterCard'}</h4> */}
                        <p className="small-text">ending in {card.cardNumber.toString().slice(-4)}</p>
                    </div>
                    
                    <p style={{ marginRight: '20px' }}> {card.nameOnCard}</p>
                    <p style={{ display: 'flex', justifyContent: 'end'  }}> {card.expirationMonth}/{card.expirationYear}</p>
                   
                </div>
            </button>
            ))}
            </div>
        </div>
        )}
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
        {/* render add your card button if there are less than 3 saved cards */}
        {cards.length < 3 && (
            <button className="red btn" style={{ marginTop: '20px', display: 'flex', alignSelf: 'flex-start'}}>Add Your Card</button>
        )}
        
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
