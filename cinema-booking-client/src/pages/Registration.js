import React, { useState, useEffect } from 'react';
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

   const [showPopup, setShowPopup] = useState(false);
   const [continueWithoutAddress, setContinueWithoutAddress] = useState(false); 

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

    let formErrors = {};
    // Form validation logic
    const validateForm = () => {
        if (!formData.firstName) formErrors.firstName = "First Name is required";
        if (!formData.lastName) formErrors.lastName = "Last Name is required";
        if (!formData.phoneNumber) formErrors.phoneNumber = "Phone Number is required";
        if (!formData.email) formErrors.email = "Email is required";
        if (!formData.password) formErrors.password = "Password is required";

        if (showPaymentInfo) {
            if (!formData.cardInfo.nameOnCard) formErrors.nameOnCard = "Name on Card is required";
            if (!formData.cardInfo.cardNumber) formErrors.cardNumber = "Card Number is required";
            if (!formData.cardInfo.expirationDate) formErrors.expirationDate = "Expiration Date is required";
            if (!formData.cardInfo.CVC) formErrors.CVC = "CVC is required";
            if (!formData.cardInfo.streetAddress) formErrors.billingStreetAddress = "Street Address is required";
            if (!formData.cardInfo.city) formErrors.billingCity = "City is required";
            if (!formData.cardInfo.state) formErrors.billingState = "State is required";
            if (!formData.cardInfo.zipCode) formErrors.billingZipCode = "Zip Code is required";
        }

        // if (showHomeAddress) {
        //     if (!formData.addressInfo.streetAddress) formErrors.homeStreetAddress = "Street Address is required";
        //     if (!formData.addressInfo.city) formErrors.homeCity = "City is required";
        //     if (!formData.addressInfo.state) formErrors.homeState = "State is required";
        //     if (!formData.addressInfo.zipCode) formErrors.homeZipCode = "Zip Code is required";
        // }
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
        if (e) {
            e.preventDefault();
        }
        const formErrors = validateForm();
        if (formData.email && !validateEmail(formData.email)) {
            formErrors.email = 'Please enter a valid email address';
        }

        // if (showPaymentInfo) {
        //     if (formData.cardInfo.cardNumber && isNaN(formData.cardInfo.cardNumber)) {
        //         formErrors.cardNumber = 'Card Number must be a number';
        //     }
        //     if (formData.cardInfo.CVC && isNaN(formData.cardInfo.CVC)) {
        //         formErrors.CVC = 'CVC must be a number';
        //     }
        //     if (formData.cardInfo.zipCode && isNaN(formData.cardInfo.zipCode)) {
        //         formErrors.billingZipCode = 'Zip Code must be a number';
        //     }
        // }

        // if (showHomeAddress) {
        //     if (formData.addressInfo.zipCode && isNaN(formData.addressInfo.zipCode)) {
        //         formErrors.homeZipCode = 'Zip Code must be a number';
        //     }
        // }

        setErrors(formErrors);
        if (Object.keys(formErrors).length === 0) {
            if (formData.addressInfo.streetAddress || formData.addressInfo.city || formData.addressInfo.state || formData.addressInfo.zipCode) {
                if (!formData.addressInfo.streetAddress || !formData.addressInfo.city || !formData.addressInfo.state || !formData.addressInfo.zipCode) {
                    setShowPopup(true);  // Show popup if the address is incomplete
                    return;
                }
            }
            try {
                // Send data to the server
                await axios.post('http://127.0.0.1:5000/api/register', formData)
                .then(response => {
                    console.log('Response:', response.data);
                    if (response.status === 200) {
                        setSuccessMessage("Registration successful! Please check your email for confirmation.");
                    }
                })
                    
            } catch (e) {
                console.error("Error registering the user:", e);
                // setErrors({ api: "Registration failed. Please try again later." });
                if (e.response && e.response.data && e.response.data.error) {
                    
                    if (e.response.data.error === "Email already exists.") {
                        const newFormErrors = { ...formErrors }; 
                        newFormErrors.email = "Email already exists";
                        setErrors(newFormErrors); // Update state properly
                    }
                    
                }
                // setErrors({ api: "Registration failed. Please try again later." });
            }
        } 
    };

    const handleClosePopup = (continueWithoutAddress) => {
        setShowPopup(false);
        setContinueWithoutAddress(continueWithoutAddress);

        if (continueWithoutAddress) {
            // Clear the address info in the formData
            setFormData((prevState) => ({
                ...prevState,
                addressInfo: {
                    streetAddress: '',
                    city: '',
                    state: '',
                    zipCode: ''
                }
            }));
        } else {
            if (!formData.addressInfo.streetAddress) formErrors.homeStreetAddress = "Street Address is required";
            if (!formData.addressInfo.city) formErrors.homeCity = "City is required";
            if (!formData.addressInfo.state) formErrors.homeState = "State is required";
            if (!formData.addressInfo.zipCode) formErrors.homeZipCode = "Zip Code is required";
            setErrors(formErrors);
        }
    };

    useEffect(() => {
        if (continueWithoutAddress) {
            handleSubmit(); // Now that address info is cleared, submit the form
            setContinueWithoutAddress(false); // Reset after submission
        }
    }, [continueWithoutAddress, formData]); // Listen for changes in formData and continueWithoutAddress

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
                        <input 
                            type="text"
                            name="streetAddress"
                            value={formData.addressInfo.streetAddress}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    addressInfo: { ...formData.addressInfo, streetAddress: e.target.value }
                                })
                            }
                        />
                        {errors.homeStreetAddress && <p className="error-message">{errors.homeStreetAddress}</p>}
                        <p>City</p>
                        <input 
                            type="text"
                            name="city"
                            value={formData.addressInfo.city}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    addressInfo: { ...formData.addressInfo, city: e.target.value }
                                })
                            }
                        />
                        {errors.homeCity && <p className="error-message">{errors.homeCity}</p>}
                        <p>State</p>
                        <input 
                            type="text"
                            name="state"
                            value={formData.addressInfo.state}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    addressInfo: { ...formData.addressInfo, state: e.target.value }
                                })
                            }
                        />
                        {errors.homeState && <p className="error-message">{errors.homeState}</p>}
                        <p>Zip Code</p>
                        <input 
                            type="text"
                            name="zipCode"
                            value={formData.addressInfo.zipCode}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    addressInfo: { ...formData.addressInfo, zipCode: e.target.value }
                                })
                            }
                        />
                        {errors.homeZipCode && <p className="error-message">{errors.homeZipCode}</p>}
                    </div>
                )}
            </div>

            <div className="center-btn">
                <button type="submit" onClick={handleSubmit} className="btn red">Create Account</button>
            </div>

            {successMessage && <p className="success">{successMessage}</p>}
            {errors.api && <p className="error">{errors.api}</p>}
            </form>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <p>Your home address information is incomplete. Would you like to continue editing or create account without address information?</p>
                        <button className="btn white" onClick={() => handleClosePopup(false)}>Go Back</button>
                        <button className="btn red" onClick={() => { handleClosePopup(true) }}>Create Account</button>
                    </div>
                </div>
            )}
        </div>
    </div>
   );
};

export default Registration;