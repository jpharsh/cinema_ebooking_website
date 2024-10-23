import React, { useState } from 'react';
import './EditProfile.css'; // Import your CSS file for styling

const EditProfile = () => {
    const [showRequiredInfo, setShowRequiredInfo] = useState(true);
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);
    const [showHomeAddress, setShowHomeAddress] = useState(false);
    const [cards, setCards] = useState([{ id: 1, name: '', cardNumber: '', expirationMonth: '', expirationYear: '', cvc: '' }]); // Initialize with one empty card
    const [isOptedInForPromotions, setIsOptedInForPromotions] = useState(false); // Promotion state

    const toggleRequiredInfo = () => setShowRequiredInfo(!showRequiredInfo);
    const togglePaymentInfo = () => setShowPaymentInfo(!showPaymentInfo);
    const toggleHomeAddress = () => setShowHomeAddress(!showHomeAddress);

    // Function to handle the change in card inputs
    const handleCardChange = (index, field, value) => {
        const newCards = [...cards];
        newCards[index][field] = value;
        setCards(newCards);
    };

    // Function to add a new card
    const addCard = () => {
        if (cards.length < 4) {
            setCards([...cards, { id: cards.length + 1, name: '', cardNumber: '', expirationMonth: '', expirationYear: '', cvc: '' }]);
        } else {
            alert("You can only add up to 4 cards.");
        }
    };

    // Function to remove a card
    const removeCard = (index) => {
        const newCards = cards.filter((_, i) => i !== index);
        setCards(newCards);
    };

    // Promotion toggle
    const handlePromotionsChange = (e) => {
        setIsOptedInForPromotions(e.target.checked);
    };

    return (
        <div>
            {/*<LoggedInNavbar />*/}
        <div className="registration-container">
           {/* <Header /> */}
            <h1>Edit Profile</h1>

            {/* Required Information */}
            <div className="section">
            <button onClick={toggleRequiredInfo} className="section-toggle">
                <span>Personal Information</span> {/* Wrap the text in a span */}
                <span>{showRequiredInfo ? '▲' : '▼'}</span> {/* The arrow */}
            </button>
            </div>
            <div className="header">Cinema Movies</div>
            <div className="registration-container">
                <h1>Edit Profile</h1>

                {/* Personal Information */}
                <div className="section">
                    <button onClick={toggleRequiredInfo} className="section-toggle">
                        <span>Personal Information</span>
                        <span>{showRequiredInfo ? '▲' : '▼'}</span>
                    </button>
                    {showRequiredInfo && (
                        <div className="section-content">
                            <div className="name-fields">
                                <div className="name-field">
                                    <p>First Name</p>
                                    <input type="text" placeholder="Enter First Name" />
                                </div>
                                <div className="name-field">
                                    <p>Last Name</p>
                                    <input type="text" placeholder="Enter Last Name" />
                                </div>
                            </div>
                            <p>Phone Number</p>
                            <input type="text" placeholder="Enter Phone Number" />
                            <p>Email</p>
                            <input type="email" placeholder="jamesbond@gmail.com" readOnly />
                            <p>Password</p>
                            <input type="password" placeholder="Enter Password" />
                        </div>
                    )}
                </div>

                {/* Payment Information */}
                <div className="section">
                    <button onClick={togglePaymentInfo} className="section-toggle">
                        <span>Payment Information</span>
                        <span>{showPaymentInfo ? '▲' : '▼'}</span>
                    </button>
                    {showPaymentInfo && (
                        <div className="section-content">
                            {cards.map((card, index) => (
                                <div key={card.id} className="card-section">
                                    <h4>Card {index + 1}</h4>
                                    <p>Name on Card</p>
                                    <input
                                        type="text"
                                        placeholder="Enter Name on Card"
                                        value={card.name}
                                        onChange={(e) => handleCardChange(index, 'name', e.target.value)}
                                    />
                                    <p>Card Number</p>
                                    <input
                                        type="text"
                                        placeholder="Enter Card Number"
                                        value={card.cardNumber}
                                        onChange={(e) => handleCardChange(index, 'cardNumber', e.target.value)}
                                    />
                                    {/* Separate inputs for month and year */}
                                    <div className="name-fields">
                                        <div className="name-field">
                                            <p>Expiration Month</p>
                                            <input
                                                type="text"
                                                placeholder="MM"
                                                maxLength="2"
                                                value={card.expirationMonth}
                                                onChange={(e) => handleCardChange(index, 'expirationMonth', e.target.value)}
                                            />
                                        </div>
                                        <div className="name-field">
                                            <p>Expiration Year</p>
                                            <input
                                                type="text"
                                                placeholder="YY"
                                                maxLength="2"
                                                value={card.expirationYear}
                                                onChange={(e) => handleCardChange(index, 'expirationYear', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <p>CVC</p>
                                    <input
                                        type="text"
                                        placeholder="Enter CVC"
                                        value={card.cvc}
                                        onChange={(e) => handleCardChange(index, 'cvc', e.target.value)}
                                    />
                                    <div className="center-btn">
                                        <button className="remove-btn" onClick={() => removeCard(index)}>Remove Card</button>
                                    </div>
                                </div>
                            ))}
                            <div className="center-btn">
                                <button className="edit-profile-btn" onClick={addCard}>Add Another Card</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Home Address */}
                <div className="section">
                    <button onClick={toggleHomeAddress} className="section-toggle">
                        <span>Home Address</span>
                        <span>{showHomeAddress ? '▲' : '▼'}</span>
                    </button>
                    {showHomeAddress && (
                        <div className="section-content">
                            <p>Street Address</p>
                            <input type="text" placeholder="Enter Street Address" />
                            <p>City</p>
                            <input type="text" placeholder="Enter City" />
                            <p>State</p>
                            <input type="text" placeholder="Enter State" />
                            <p>Zip Code</p>
                            <input type="text" placeholder="Enter Zip Code" />
                        </div>
                    )}
                </div>

                {/* Promotions Section */}
                <div className="promotion-toggle">
                    <label className="toggle-label">
                        Receive promotions and special offers
                        <input
                            type="checkbox"
                            checked={isOptedInForPromotions}
                            onChange={handlePromotionsChange}
                            className="toggle-input"
                        />
                        <span className="slider"></span>
                    </label>
                </div>
                <div className="promotion-status">
                    {isOptedInForPromotions ? (
                        <p className="opted-in">You are currently registered for promotions.</p>
                    ) : (
                        <p className="opted-out">You are not registered for promotions.</p>
                    )}
                </div>

                <div className="center-btn">
                    <button className="edit-profile-btn">Save Changes</button>
                </div>
            </div>
        </div>
        </div>
    );
};

export default EditProfile;
