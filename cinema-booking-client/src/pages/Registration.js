import React, { useState } from 'react';
import './EditProfile.css'; // Import your CSS file for styling
import Navbar from '../components/Navbar';
// import Header from '../components/Header'; // Import the Header component


const Registration = () => {
    // States to control the visibility of sections
    const [showRequiredInfo, setShowRequiredInfo] = useState(true);
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);
    const [showHomeAddress, setShowHomeAddress] = useState(false);
    const [showCard1, setShowCard1] = useState(false); // For Card 1 toggle

    // Functions to toggle sections
    const toggleRequiredInfo = () => setShowRequiredInfo(!showRequiredInfo);
    const togglePaymentInfo = () => setShowPaymentInfo(!showPaymentInfo);
    const toggleHomeAddress = () => setShowHomeAddress(!showHomeAddress);
    const toggleCard1 = () => setShowCard1(!showCard1);

    return (
        <div>
            <Navbar />
            <div className="registration-container">
            {/* <Header /> */}
                <h1>Create Profile</h1>

                {/* Required Information */}
                <div className="section">
                <button onClick={toggleRequiredInfo} className="section-toggle">
        <span>Required Information</span> {/* Wrap the text in a span */}
        <span>{showRequiredInfo ? '▲' : '▼'}</span> {/* The arrow */}
    </button>

        {showRequiredInfo && (
            <div className="section-content">
                <div className="name-fields">
                    <div className="name-field">
                        <p>First Name</p>
                        <input type="text" />  {/*First Name*/}
                    </div>
                    <div className="name-field">
                        <p>Last Name</p>
                        <input type="text" /> {/*Last Name*/}
                    </div>
                </div>
                <p>Phone Number</p>
                <input type="text" /> {/*Phone Number*/}
                <p>Email</p>
                <input type="email" /> {/*Email*/}
                <p>Password</p>
                <input type="password" /> {/*Password*/}
            </div>
        )}
    </div>


                {/* Payment Information */}
                <div className="section">
                    <button onClick={togglePaymentInfo} className="section-toggle">
                        <span>Payment Information (Optional)</span>
                        <span>{showPaymentInfo ? '▲' : '▼'}</span>
                    </button>
                    {showPaymentInfo && (
                        <div className="section-content">
                            {/* Toggle for Card 1 */}
                            <div className="section">
                                <button onClick={toggleCard1} className="section-toggle">
                                    <span>Card 1</span>
                                    <span>{showCard1 ? '▲' : '▼'}</span>
                                </button>

                                {showCard1 && (
                                    <div className="section-content">
                                        <p>Name on Card</p>
                                        <input type="text"/>
                                        <p>Card Number</p>
                                        <input type="text"/>
                                        <p>Expiration Date</p>
                                        <input type="text"/>
                                        <p>CVC</p>
                                        <input type="text"/>
                                        <p>Street Address</p>
                                        <input type="text"/>
                                        <p>City</p>
                                        <input type="text"/>
                                        <p>State</p>
                                        <input type="text"/>
                                        <p>Zip Code</p>
                                        <input type="text"/>
                                        <div className="center-btn">
                                            <button className="btn red">Save Card</button>
                                            <button className="btn white">Remove Card</button>
                                        </div>
                                    </div>
                                )}
                                <div className="center-btn">
                                    <button className="btn red">+ Add New Card</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Home Address */}
                <div className="section">
                    <button onClick={toggleHomeAddress} className="section-toggle">
                        <span>Home Address (Optional)</span> 
                        <span>{showHomeAddress ? '▲' : '▼'}</span>
                    </button>
                    {showHomeAddress && (
                        <div className="section-content">
                            <p>Street Address</p>
                            <input type="text"/>
                            <p>City</p>
                            <input type="text"/>
                            <p>State</p>
                            <input type="text"/>
                            <p>Zip Code</p>
                            <input type="text"/>
                        </div>
                    )}
                </div>

                <div className="center-btn">
                <button className="btn red">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default Registration;
