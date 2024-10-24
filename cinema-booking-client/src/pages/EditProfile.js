import React, { useState, useEffect } from 'react';
import './EditProfile.css'; // Import your CSS file for styling
import LoggedInNavbar from '../components/LoggedInNavbar';
import axios from 'axios';

const EditProfile = () => {
    const [showRequiredInfo, setShowRequiredInfo] = useState(true);
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);
    const [showHomeAddress, setShowHomeAddress] = useState(false);
    const [cards, setCards] = useState([{ id: 1, nameOnCard: '', cardNumber: '', expirationMonth: '', expirationYear: '', cvc: '', streetAddress: '', city: '', state: '', zipCode: ''}]); // Initialize with one empty card
    const [isOptedInForPromotions, setIsOptedInForPromotions] = useState(false); // Promotion state

    const [currentPassword, setCurrentPassword] = useState('stinks'); 
    const [enteredPassword, setEnteredPassword] = useState('');
    const [passwordVerified, setPasswordVerified] = useState(false); // Whether the user entered the correct current password
    const [newPassword, setNewPassword] = useState('');


    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        cardInfo: {
            nameOnCard: '',
            cardNumber: '',
            expirationMonth: '',
            expirationYear: '',
            cvc: '',
            streetAddress: '',
            city: '',
            state: '',
            zipCode: ''
        },
        addressInfo: {
            streetAddress: '',
            city: '',
            state: '',
            zipCode: ''
        }
    });

    // Fetch user data on component mount
    useEffect(() => {
        // Fetch user information
        axios.get('http://127.0.0.1:5000/api/user-get')
            .then(response => {
                console.log(response.data); // Check what data is returned
                const data = response.data;
                setUserData(prevState => ({
                    ...prevState, // Keep existing state
                    firstName: data.f_name,
                    lastName: data.l_name,
                    phoneNumber: data.phone_num,
                    email: data.email,
                    password: '', // Keep this empty for security reasons
                    addressInfo: {
                        ...prevState.addressInfo, // Spread existing address info if necessary
                        streetAddress: data.street_address,
                        city: data.city,
                        state: data.state,
                        zipCode: data.zip_code
                    }
                }));
                setIsOptedInForPromotions(data.promo_sub);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

        // Fetch card information
        axios.get('http://127.0.0.1:5000/api/card-get')
            .then(response => {
                console.log(response.data); // Check what data is returned
                const data = response.data;
                setUserData(prevState => ({
                    ...prevState, // Keep existing state
                    cardInfo: {
                        ...prevState.cardInfo, // Spread existing card info if necessary
                        nameOnCard: data.name_on_card,
                        cardNumber: data.card_num,
                        expirationMonth: data.exp_month,
                        expirationYear: data.exp_year,
                        cvc: data.cv_num,
                        streetAddress: data.street_address,
                        city: data.city,
                        state: data.state,
                        zipCode: data.zip_code
                    }
                }));
            })
            .catch(error => {
                console.error('Error fetching card data:', error);
            });
    }, []);


    const toggleRequiredInfo = () => setShowRequiredInfo(!showRequiredInfo);
    const togglePaymentInfo = () => setShowPaymentInfo(!showPaymentInfo);
    const toggleHomeAddress = () => setShowHomeAddress(!showHomeAddress);

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    let userErrors = {};
    // Form validation logic
    const validateForm = () => {
        if (!userData.firstName) userErrors.firstName = "First Name is required";
        if (!userData.lastName) userErrors.lastName = "Last Name is required";
        if (!userData.phoneNumber) userErrors.phoneNumber = "Phone Number is required";
        //if (!userData.password) formErrors.password = "Password is required";
        return userErrors;
    };

    const validatePhoneNumber = (phoneNumber) => {
        // Simple regex for phone number validation
        const phoneNumberPattern = /^[0-9]{10}$/;
        return phoneNumberPattern.test(phoneNumber);
    };

    const validateCardNumber = (cardNumber) => {
        // Simple regex for card number validation
        const cardNumberPattern = /^[0-9]{16}$/;
        return cardNumberPattern.test(cardNumber);
    };

    //const validateExpirationDate = (expirationDate) => {
        // Simple regex for expiration date validation
        //const expirationDatePattern = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
        //return expirationDatePattern.test(expirationDate);
    //};

    const validateCVC = (cvc) => {
        //Simple regex for cvc validation
        const cvcPattern = /^[0-9]{3}$/;
        return cvcPattern.test(cvc);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

     // Handle address changes
     const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            addressInfo: {
                ...prevState.addressInfo,
                [name]: value
            }
        }));
    };

    
    // Function to handle the change in card inputs
    const handleCardChange = (index, field, value) => {
        const newCards = [...cards];
        newCards[index][field] = value;
        setCards(newCards);

        
        setUserData((prevState) => ({
            ...prevState,
            cardInfo: {
                ...prevState.cardInfo,
                [field]: value
            }
        }));
    };

    // Function to add a new card
    const addCard = () => {
        if (cards.length < 4) {
            setCards([...cards, { id: cards.length + 1, nameOnCard: '', cardNumber: '', expirationMonth: '', expirationYear: '', cvc: '', streetAddress: '', city: '', state: '', zipCode: ''}]);
        } else {
            alert("You can only add up to 4 cards.");
        }
    };

    // Function to remove a card
    const removeCard = (index) => {
        if (cards.length > 1) {
            const newCards = cards.filter((_, i) => i !== index);
            setCards(newCards);
        }
    };

    // Promotion toggle
    const handlePromotionsChange = (e) => {
        setIsOptedInForPromotions(e.target.checked);
    };

    // Verify password function
    const verifyPassword = () => {
        if (enteredPassword === currentPassword) {
            setPasswordVerified(true); // Allow editing if password is correct
            alert("Password verified! You can now update your password.");
        } else {
            alert("Incorrect password, please try again.");
        }
    };

    return (
        <div>
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
                                    <input 
                                        type="text"
                                        name="firstName"
                                        value={userData.firstName}
                                        onChange={handleInputChange}
                                        className={errors.firstName ? 'error' : ''}
                                    />
                                    {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                                </div>
                                <div className="name-field">
                                    <p>Last Name</p>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={userData.lastName}
                                        onChange={handleInputChange}
                                        className={errors.lastName ? 'error' : ''}
                                    />
                                    {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                                </div>
                            </div>
                            <p>Phone Number</p>
                            <input 
                                type="text"
                                name="phoneNumber"
                                value={userData.phoneNumber}
                                onChange={handleInputChange}
                                className={errors.phoneNumber ? 'error' : ''}
                            />
                            {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
                            <p>Email</p>
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                readOnly
                            />
                             {/* Current Password Verification */}
                             {!passwordVerified ? (
                                <>
                                    <p>Enter Current Password to Edit:</p>
                                    <input
                                        type="password"
                                        placeholder="Enter Current Password"
                                        value={enteredPassword}
                                        onChange={(e) => setEnteredPassword(e.target.value)}
                                    />
                                    <div className="center-btn">
                                        <button className="edit-profile-btn" onClick={verifyPassword}>Verify Password</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* New Password Fields (only show if current password is verified) */}
                                    <p>New Password</p>
                                    <input
                                        type="password"
                                        placeholder="Enter New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </>
                            )}
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
                                        value={userData.cardInfo.nameOnCard}
                                        onChange={(e) => handleCardChange(index, 'nameOnCard', e.target.value)}
                                        className={errors.nameOnCard ? 'error' : ''}
                                    />
                                    {errors.nameOnCard && <p className="error-message">{errors.nameOnCard}</p>}
                                    <p>Card Number</p>
                                    <input
                                        type="text"
                                        placeholder="Enter Card Number"
                                        value={userData.cardInfo.cardNumber}
                                        onChange={(e) => handleCardChange(index, 'cardNumber', e.target.value)}
                                        className={errors.cardNumber ? 'error' : ''} 
                                    />
                                    {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}
                                    {/* Separate inputs for month and year */}
                                    <p>Expiration Month</p>
                                    <input
                                        type="text"
                                        placeholder="MM"
                                        //maxLength="2"
                                        value={userData.cardInfo.expirationMonth}
                                        onChange={(e) => handleCardChange(index, 'expirationMonth', e.target.value)}
                                        className={errors.expirationMonth ? 'error' : ''} 
                                    />
                                    {errors.expirationMonth && <p className="error-message">{errors.expirationMonth}</p>}
                                    <p>Expiration Year</p>
                                    <input
                                        type="text"
                                        placeholder="YY"
                                        //maxLength="2"
                                        value={userData.cardInfo.expirationYear}
                                        onChange={(e) => handleCardChange(index, 'expirationYear', e.target.value)}
                                        className={errors.expirationYear ? 'error' : ''} 
                                    />
                                    {errors.expirationYear && <p className="error-message">{errors.expirationYear}</p>}
                                    <p>CVC</p>
                                    <input
                                        type="text"
                                        placeholder="Enter CVC"
                                        value={userData.cardInfo.cvc}
                                        onChange={(e) => handleCardChange(index, 'cvc', e.target.value)}
                                        className={errors.cvc ? 'error' : ''} 
                                    />
                                    {errors.cvc && <p className="error-message">{errors.cvc}</p>}
                                    <p>Street Address</p>
                                    <input
                                        type="text"
                                        name="streetAddress"
                                        value={userData.cardInfo.streetAddress}
                                        onChange={(e) => handleCardChange(index, 'streetAddress', e.target.value)}
                                        placeholder="Enter Street Address"
                                        className={errors.streetAddress ? 'error' : ''} 
                                    />
                                    <p>City</p>
                                    <input
                                        type="text"
                                        name="city"
                                        value={userData.cardInfo.city}
                                        onChange={(e) => handleCardChange(index, 'city', e.target.value)}
                                        placeholder="Enter City"
                                        className={errors.city ? 'error' : ''} 
                                    />
                                    <p>State</p>
                                    <input
                                        type="text"
                                        name="state"
                                        value={userData.cardInfo.state}
                                        onChange={(e) => handleCardChange(index, 'state', e.target.value)}
                                        placeholder="Enter State"
                                        className={errors.state ? 'error' : ''} 
                                    />
                                    <p>Zip Code</p>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={userData.cardInfo.zipCode}
                                        onChange={(e) => handleCardChange(index, 'zipCode', e.target.value)}
                                        placeholder="Enter Zip Code"
                                        className={errors.zipCode ? 'error' : ''} 
                                    />
                                    <div className="center-btn">
                                        <button className="remove-btn" onClick={() => removeCard(index)}>Remove Card</button>
                                    </div>
                                </div>
                            ))}
                            <div className="center-btn">
                                <button className="edit-profile-btn" onClick={addCard}>Add Card</button>
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
                            <input
                                type="text"
                                name="streetAddress"
                                value={userData.addressInfo.streetAddress}
                                onChange={handleAddressChange}
                                placeholder="Enter Street Address"
                                className={errors.streetAddress ? 'error' : ''} 
                            />
                            <p>City</p>
                            <input
                                type="text"
                                name="city"
                                value={userData.addressInfo.city}
                                onChange={handleAddressChange}
                                placeholder="Enter City"
                                className={errors.city ? 'error' : ''} 
                            />
                            <p>State</p>
                            <input
                                type="text"
                                name="state"
                                value={userData.addressInfo.state}
                                onChange={handleAddressChange}
                                placeholder="Enter State"
                                className={errors.state ? 'error' : ''} 
                            />
                            <p>Zip Code</p>
                            <input
                                type="text"
                                name="zipCode"
                                value={userData.addressInfo.zipCode}
                                onChange={handleAddressChange}
                                placeholder="Enter Zip Code"
                                className={errors.zipCode ? 'error' : ''} 
                            />
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
