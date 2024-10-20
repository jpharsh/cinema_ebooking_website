import React, { useState } from 'react';
import './EditProfile.css';
import Navbar from '../components/Navbar';
// import Header from '../components/Header'; // Import the Header component
import axios from 'axios'; // Axios for sending data to the server

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

   const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        subscribeToPromo: false,
        cardInfo: {
            nameOnCard: '',
            cardNumber: '',
            expirationDate: '',
            cvc: '',
            address: '',
            city: '',
            state: '',
            zip: ''
        },
        addressInfo: {
            streetAddress: '',
            city: '',
            state: '',
            zipCode: ''
        }
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // Form validation logic
    const validateForm = () => {
        let formErrors = {};
        if (!formData.firstName) formErrors.firstName = "First Name is required";
        if (!formData.lastName) formErrors.lastName = "Last Name is required";
        if (!formData.phoneNumber) formErrors.phoneNumber = "Phone Number is required";
        if (!formData.email) formErrors.email = "Email is required";
        if (!formData.password) formErrors.password = "Password is required";
        return formErrors;
    };

    const validateEmail = (email) => {
        // Simple regex for email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (!formData.email || !validateEmail(formData.email)) {
            formErrors.email = 'Please enter a valid email address';
        }
        if (Object.keys(formErrors).length === 0) {
            try {
                // Send data to the server
                const response = await axios.post('http://127.0.0.1:5000/api/register', formData)
                .then(response => {
                    console.log('Response:', response.data);
                    if (response.status === 200) {
                        setSuccessMessage("Registration successful! Please check your email for confirmation.");
                    }
                })
                    
            } catch (error) {
                console.error("Error registering the user:", error);
                setErrors({ api: "Registration failed. Please try again later." });
            }
        } else {
            setErrors(formErrors);
        }
    };


   return (
    <div>
        <Navbar />
        <div className="registration-container">
            <h1>Create Profile</h1>

            <form onSubmit={handleSubmit}>
            {/* Required Information */}
            <div className="section">
                <button type="button" onClick={toggleRequiredInfo} className="section-toggle">
                    <span>Required Information</span> {/* Wrap the text in a span */}
                    <span>{showRequiredInfo ? '▲' : '▼'}</span> {/* The arrow */}
                </button>

                {showRequiredInfo && (
                    <div className="section-content">
                         <div className="name-fields">
                            <div className="name-field">
                                <p>First Name</p>
                                <input 
                                    type="text" 
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={errors.firstName ? 'error' : ''}      
                                />
                                {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                            </div>
                            <div className="name-field">
                                <p>Last Name</p>
                                <input 
                                    type="text" 
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={errors.lastName ? 'error' : ''} 
                                /> 
                                {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                            </div>
                        </div>
                        <p>Phone Number</p>
                        <input 
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange} 
                            className={errors.phoneNumber ? 'error' : ''}    
                        />
                        {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
                        <p>Email</p>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''} 
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                        <p>Password</p>
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''} 
                        /> 
                        {errors.password && <p className="error-message">{errors.password}</p>}

                        {/* Promotion Subscription */}
                        <div className="promo">
                            <label>
                                <input
                                    type="checkbox"
                                    name="subscribeToPromo"
                                    checked={formData.subscribeToPromo}
                                    onChange={() =>
                                        setFormData({ ...formData, subscribeToPromo: !formData.subscribeToPromo })
                                    }
                                />
                                Subscribe to Promotions
                            </label>
                        </div>
                    </div>
                )}
            </div>

            {/* Payment Information */}
            <div className="section">
                <button type="button" onClick={togglePaymentInfo} className="section-toggle">
                    <span>Payment Information (Optional)</span>
                    <span>{showPaymentInfo ? '▲' : '▼'}</span>
                </button>
                {showPaymentInfo && (
                    <div className="section-content">
                        {/* Toggle for Card 1 */}
                        <div className="section">
                            <button type="button" onClick={toggleCard1} className="section-toggle">
                                <span>Card 1</span>
                                <span>{showCard1 ? '▲' : '▼'}</span>
                            </button>

                            {showCard1 && (
                                <div className="section-content">
                                    <p>Name on Card</p>
                                    <input 
                                        type="text"
                                        name="nameOnCard"
                                        value={formData.cardInfo.nameOnCard}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                cardInfo: { ...formData.cardInfo, nameOnCard: e.target.value }
                                            })
                                        }
                                    />
                                    <p>Card Number</p>
                                    <input 
                                        type="text"
                                        name="cardNumber"
                                        value={formData.cardInfo.cardNumber}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                cardInfo: { ...formData.cardInfo, cardNumber: e.target.value }
                                            })
                                        }
                                    />
                                    <p>Expiration Date</p>
                                    <input 
                                        type="text"
                                        name="expirationDate"
                                        value={formData.cardInfo.expirationDate}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                cardInfo: { ...formData.cardInfo, expirationDate: e.target.value }
                                            })
                                        }
                                    />
                                    <p>CVC</p>
                                    <input 
                                        type="text"
                                        name="CVC"
                                        value={formData.cardInfo.CVC}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                cardInfo: { ...formData.cardInfo, CVC: e.target.value }
                                            })
                                        }
                                    />
                                    <p>Street Address</p>
                                    <input 
                                        type="text"
                                        name="streetAddress"
                                        value={formData.cardInfo.streetAddress}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                cardInfo: { ...formData.cardInfo, streetAddress: e.target.value }
                                            })
                                        }
                                    />
                                    <p>City</p>
                                    <input 
                                        type="text"
                                        name="city"
                                        value={formData.cardInfo.city}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                cardInfo: { ...formData.cardInfo, city: e.target.value }
                                            })
                                        }
                                    />
                                    <p>State</p>
                                    <input 
                                        type="text"
                                        name="state"
                                        value={formData.cardInfo.state}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                cardInfo: { ...formData.cardInfo, state: e.target.value }
                                            })
                                        }
                                    />
                                    <p>Zip Code</p>
                                    <input 
                                        type="text"
                                        name="zipCode"
                                        value={formData.cardInfo.zipCode}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                cardInfo: { ...formData.cardInfo, zipCode: e.target.value }
                                            })
                                        }
                                    />
                                    <div className="center-btn">
                                        <button type="button" className="btn red">Save Card</button>
                                        <button type="button" className="btn white">Remove Card</button>
                                    </div>
                                </div>
                            )}
                            <div className="center-btn">
                                <button type="button" className="btn red">+ Add New Card</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>


            {/* Home Address */}
            <div className="section">
                <button type="button" onClick={toggleHomeAddress} className="section-toggle">
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
                <button type="submit" onClick={handleSubmit} className="btn red">Create Account</button>
            </div>

            {successMessage && <p className="success">{successMessage}</p>}
            {errors.api && <p className="error">{errors.api}</p>}
            </form>
        </div>
    </div>
   );
};

export default Registration;