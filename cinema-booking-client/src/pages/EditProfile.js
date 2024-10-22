import React, { useState } from 'react';
import './EditProfile.css'; // Import your CSS file for styling
import LoggedInNavbar from '../components/LoggedInNavbar';

const EditProfile = () => {
    const [showRequiredInfo, setShowRequiredInfo] = useState(true);
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);
    const [showHomeAddress, setShowHomeAddress] = useState(false);
    const [showCard1, setShowCard1] = useState(false); // For Card 1 toggle
    const [isOptedInForPromotions, setIsOptedInForPromotions] = useState(false); // Promotion state

    const toggleRequiredInfo = () => setShowRequiredInfo(!showRequiredInfo);
    const togglePaymentInfo = () => setShowPaymentInfo(!showPaymentInfo);
    const toggleHomeAddress = () => setShowHomeAddress(!showHomeAddress);
    const toggleCard1 = () => setShowCard1(!showCard1);

    const handlePromotionsChange = (e) => {
        setIsOptedInForPromotions(e.target.checked);
    };

    return (
        <div>
            <div className="header">Cinema Movies</div>
            <LoggedInNavbar />
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
                            <input type="email" placeholder="Enter Email" />
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
                            <button onClick={toggleCard1} className="section-toggle">
                                <span>Card 1</span>
                                <span>{showCard1 ? '▲' : '▼'}</span>
                            </button>
                            {showCard1 && (
                                <div className="section-content">
                                    <p>Name on Card</p>
                                    <input type="text" placeholder="Enter Name on Card" />
                                    <p>Card Number</p>
                                    <input type="text" placeholder="Enter Card Number" />
                                    <p>Expiration Date</p>
                                    <input type="text" placeholder="MM/YY" />
                                    <p>CVC</p>
                                    <input type="text" placeholder="Enter CVC" />
                                    <p>Billing Address</p>
                                    <input type="text" placeholder="Street Address" />
                                    <input type="text" placeholder="City" />
                                    <input type="text" placeholder="State" />
                                    <input type="text" placeholder="Zip Code" />
                                    <div className="center-btn">
                                        <button className="edit-profile-btn">Save Card</button>
                                        <button className="remove-btn">Remove Card</button>
                                    </div>
                                </div>
                            )}
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
    );
};

export default EditProfile;