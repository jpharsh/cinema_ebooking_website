import React, { useState, useEffect } from "react";
import "./EditProfile.css"; // Import your CSS file for styling
import axios from "axios";
import isEqual from "lodash/isEqual";

const EditProfile = () => {
    
    const [showRequiredInfo, setShowRequiredInfo] = useState(true);
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);
    const [showHomeAddress, setShowHomeAddress] = useState(false);
    const [cards, setCards] = useState([
      {
        id: 1,
        nameOnCard: "",
        cardNumber: "",
        expirationMonth: "",
        expirationYear: "",
        cvc: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
      },
    ]); // Initialize with one empty card
    const [oldCards, setOldCards] = useState([
      {
        id: 1,
        nameOnCard: "",
        cardNumber: "",
        expirationMonth: "",
        expirationYear: "",
        cvc: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
      },
    ]); // Initialize with one empty card

    const [isOptedInForPromotions, setIsOptedInForPromotions] = useState(false); // Promotion state
    const [isOldInForPromotions, setIsOldInForPromotions] = useState(false); // Promotion state
  
    //const [currentPassword, setCurrentPassword] = useState('');
    const [enteredPassword, setEnteredPassword] = useState("");
    const [passwordVerified, setPasswordVerified] = useState(false); // Whether the user entered the correct current password
    const [newPassword, setNewPassword] = useState("");
  
    const [userData, setUserData] = useState({
      id: 0,
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
  
      addressInfo: {
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
      },
    });
    const [originalData, setOriginalData] = useState({
      id: 0,
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
  
      addressInfo: {
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
      },
    });



useEffect(() => {
    async function loadUserData() {
        // Call fetchUserId to retrieve the user ID
        const userId = await fetchUserId();

        if (!userId) {
            console.error("User is not logged in or session is invalid.");
            return;
        }

        try {
            const token = localStorage.getItem('token');

            // Fetch user information
            const userResponse = await axios.get(`http://127.0.0.1:5000/api/user-get?id=${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const userData = userResponse.data;
            console.log("Fetched user data:", userData);
            setUserData({
                id: userData.id,
                firstName: userData.f_name || '',
                lastName: userData.l_name || '',
                phoneNumber: userData.phone_num || '',
                email: userData.email || '',
                addressInfo: {
                    streetAddress: userData.street_address || '',
                    city: userData.city || '',
                    state: userData.state || '',
                    zipCode: userData.zip_code || ''
                }
            });
            setIsOptedInForPromotions(userData.promo_sub || false);
            setIsOldInForPromotions(userData.promo_sub || false);

            const originalData = userData;
            setOriginalData({
              id: originalData.id,
              firstName: originalData.f_name || '',
              lastName: originalData.l_name || '',
              phoneNumber: originalData.phone_num || '',
              email: originalData.email || '',
              addressInfo: {
                  streetAddress: originalData.street_address || '',
                  city: originalData.city || '',
                  state: originalData.state || '',
                  zipCode: originalData.zip_code || ''
              }
            });
            // Fetch card information
            const cardResponse = await axios.get(`http://127.0.0.1:5000/api/cards-get?user_id=${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const cardData = cardResponse.data;
            console.log("Fetched card data:", cardData);
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
              setOldCards(cardData.card_data.map(card => ({
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
            console.error("Error fetching user or card data:", error);
        }
    }

    loadUserData();
}, []);


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



  const toggleRequiredInfo = () => setShowRequiredInfo(!showRequiredInfo);
  const togglePaymentInfo = () => setShowPaymentInfo(!showPaymentInfo);
  const toggleHomeAddress = () => setShowHomeAddress(!showHomeAddress);

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  let userErrors = {};


  // Form validation logic
  const validateForm = () => {
    if (!userData.firstName) userErrors.firstName = "First Name is required";
    if (!userData.lastName) userErrors.lastName = "Last Name is required";
    if (!userData.phoneNumber)
      userErrors.phoneNumber = "Phone Number is required";
    //if (!userData.password) formErrors.password = "Password is required";
    return userErrors;
  };

  const validateFirstName = (firstName) => {
    // Regular expression: At least 2 alphabetic characters
    const namePattern = /^[A-Za-z]{1,}$/;
    return namePattern.test(firstName);
  };

  const validateLastName = (lastName) => {
      // Regular expression: At least 2 alphabetic characters
      const namePattern = /^[A-Za-z]{1,}$/;
      return namePattern.test(lastName);
  };

  const validateNameOnCard = (nameOnCard) => {
      // Regular expression: At least 2 alphabetic characters
      const namePattern = /^[A-Za-z\s]{1,}$/;
      console.log(`Validating "${nameOnCard}":`, namePattern.test(nameOnCard));
      return namePattern.test(nameOnCard);
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

  const validateCVC = (cvc) => {
    //Simple regex for cvc validation
    const cvcPattern = /^[0-9]{3}$/;
    return cvcPattern.test(cvc);
  };

  // Handle form submission for updating profile
  const handleSubmit = async (e) => {
    console.log("clicked");
    if (e) {
      e.preventDefault();
    }
    const formErrors = validateForm(); // Run validations
    console.log("2click");
    // Validate phone number format
    if (userData.phoneNumber && !validatePhoneNumber(userData.phoneNumber)) {
      formErrors.phoneNumber =
        "Phone Number must be a 10-digit number (no spaces or dashes)";
    }
    if (userData.firstName && !validateFirstName(userData.firstName)) {
        formErrors.firstName = "First name must be at least 1 characters long and contain only letters";
    }
    if (userData.lastName && !validateLastName(userData.lastName)) {
        formErrors.lastName = "Last name must be at least 1 characters long and contain only letters";
    }
    
    console.log("3click");

    // Validate card information if Payment Info section is shown
    if (showPaymentInfo) {
      const cardErrors = [];
      cards.forEach((card, index) => {
        let cardError = {};
    
        // Validate fields and populate cardError object
        if (!card.nameOnCard){
          cardError.nameOnCard = "Name on Card is required";
        } else if (!validateNameOnCard(card.nameOnCard)) {
          cardError.nameOnCard = "Name must be at least 1 characters long and contain only letters"
        }
        if (!card.cardNumber) {
          cardError.cardNumber = "Card Number is required";
        } else if (!validateCardNumber(card.cardNumber)) {
          cardError.cardNumber = "Card Number must be a 16-digit number";
        }
        if (!card.cvc) {
          cardError.cvc = "CVC is required";
        } else if (!validateCVC(card.cvc)) {
          cardError.cvc = "CVC must be a 3-digit number";
        }
        if (!card.streetAddress) {
          cardError.streetAddress = "Street Address is required";
        }
        if (!card.expirationMonth) {
          cardError.expirationMonth = "Expiration Month is required"
        }
        if (!card.expirationYear) {
          cardError.expirationYear = "Expiration Year is required"
        }
        if (!card.city) {
          cardError.city = "City is required";
        }
        if (!card.state) {
          cardError.state = "State is required";
        }
        if (!card.zipCode || isNaN(card.zipCode)) {
          cardError.zipCode = "Zip Code is required";
        }

        // If any validation failed, add to the cardErrors list
        if (Object.keys(cardError).length > 0) {
          //cardErrors.push(cardError);
          cardErrors[index] = cardError;
        }
      });
    
      console.log("Card errors:", cardErrors); // Log the errors for better visibility
    
      // Check if any card has errors
      const hasCardErrors = cardErrors.length > 0;
    
      console.log("After checking card errors. Has errors:", hasCardErrors); // Log if any card has errors
    
      if (hasCardErrors) {
        setErrors(cardErrors);
        alert("please fill fields correctly");
        return; // Stop submission if there are errors
      }
    
      console.log("after3"); // This should only run if there are no errors
    }
    
    
    console.log("4click");
    // Update state with form validation errors
    setErrors(formErrors);
    console.log("before obj if");

    if (Object.keys(formErrors).length === 0) {
      // Submit only if no form errors
      try {
        const dataToSend = {
          ...userData,
          password: newPassword || userData.password,
          cards: cards, // Include updated card data
          isOptedInForPromotions,
        };
        console.log(dataToSend.cards);

        // Send updated user info to the backend
        if (!isEqual(originalData, userData) || (dataToSend.password !== userData.password) || !isEqual(oldCards, cards) || (isOptedInForPromotions !== isOldInForPromotions)) {
          console.log(cards);
          console.log(dataToSend);
          const response = await axios.post(
            "http://127.0.0.1:5000/api/edit",
            dataToSend
          );
          console.log(response.data);
          if ((response.status === 200)) {
            setSuccessMessage("Profile updated successfully! Reloading page");
            setTimeout(() => {
              window.location.reload(); // Refresh the page
            }, 3000);
          }
        }
        else {
          setSuccessMessage("No updates made, reloading page.")
          console.log("No updates made, skipping submission.");
          setTimeout(() => {
            window.location.reload(); // Refresh the page
          }, 3000);
        }
      } catch (e) {
        console.error("Error updating the profile:", e);
      }
    }
    else {
      alert("please fill fields correctly");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle address changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      addressInfo: {
        ...prevState.addressInfo,
        [name]: value,
      },
    }));
  };

  // Function to handle changes in the card inputs
  const handleCardChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value; // Update only the targeted card's field
    setCards(updatedCards); // Update cards state directly
  };

  const removeCard = async (index, cardId) => {
    console.log("this is before the if statement");
    console.log("cardId:", cardId);
    console.log("index:", index);

    if (cards.length >= 1) {
      try {
        console.log([...cards.filter((card) => card.id !== cardId)]);
        setCards([...cards.filter((card) => card.id !== cardId)]);
        const updatedErrors = errors.filter((_, i) => i !== index);
        setErrors(updatedErrors);
        console.log(cardId + "this is in the if statement");
      } catch (error) {
        console.error("Error deleting card:", error);
        alert("An error occurred while deleting the card.");
      }
    }

    console.log(cards);
  };

  // Function to add a new card
  const addCard = () => {
    if (cards.length < 3) {
      setCards((prevCards) => [
        ...prevCards,
        {
          id: prevCards.length + 1,
          nameOnCard: "",
          cardNumber: "",
          expirationMonth: "",
          expirationYear: "",
          cvc: "",
          streetAddress: "",
          city: "",
          state: "",
          zipCode: "",
        },
      ]);
      setErrors((prevErrors) => [
        ...prevErrors,
        {
          nameOnCard: "",
          cardNumber: "",
          expirationMonth: "",
          expirationYear: "",
          cvc: "",
          streetAddress: "",
          city: "",
          state: "",
          zipCode: ""
        }
      ]);
    } else {
      alert("You can only add up to 3 cards.");
    }
  };

  // Function to remove a card

  // Promotion toggle
  const handlePromotionsChange = (e) => {
    setIsOptedInForPromotions(e.target.checked);
  };

  // Verify password function
  const verifyPassword = () => {
    axios
      .post("http://127.0.0.1:5000/api/verify-password", {
        password: enteredPassword,
        id: userData.id,
      })
      .then((response) => {
        console.log("Password verification response:", response.data);
        if (response.data.passwordVerified) {
          console.log("Password verified!");
          setPasswordVerified(true); // Allow editing if password is correct
          alert("Password verified! You can now update your password.");
        } else {
          alert("Incorrect password, please try again.");
        }
      })
      .catch((error) => {
        console.error("Error verifying password:", error);
        alert(
          "An error occurred during password verification. Please try again."
        );
      });
  };

  return (
    <div>
      <div className="registration-container">
        <h1>Edit Profile</h1>

        {/* Personal Information */}
        <div className="section">
          <button onClick={toggleRequiredInfo} className="section-toggle">
            <span>Personal Information</span>
            <span>{showRequiredInfo ? "▲" : "▼"}</span>
          </button>
          {showRequiredInfo && (
            <div className="section-content">
              <div className="name-fields">
                <div className="name-field">
                  <p>First Name</p>
                  <input
                    type="text"
                    placeholder="Required field"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? "error" : ""}
                  />
                  {errors.firstName && (
                    <p className="error-message">{errors.firstName}</p>
                  )}
                </div>
                <div className="name-field">
                  <p>Last Name</p>
                  <input
                    type="text"
                    placeholder="Required field"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? "error" : ""}
                  />
                  {errors.lastName && (
                    <p className="error-message">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <p>Phone Number</p>
              <input
                type="text"
                placeholder="Required field"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleInputChange}
                className={errors.phoneNumber ? "error" : ""}
              />
              {errors.phoneNumber && (
                <p className="error-message">{errors.phoneNumber}</p>
              )}
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
                    <button
                      className="edit-profile-btn"
                      onClick={verifyPassword}
                    >
                      Verify Password
                    </button>
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
            <span>{showPaymentInfo ? "▲" : "▼"}</span>
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
                    value={card.nameOnCard}
                    onChange={(e) =>
                      handleCardChange(index, "nameOnCard", e.target.value)
                    }
                    className={errors[index]?.nameOnCard ? "error" : ""}
                  />
                  {errors[index]?.nameOnCard && (
                    <p className="error-message">{errors[index]?.nameOnCard}</p>
                  )}
                  <p>Card Number</p>
                  <input
                    type="text"
                    placeholder="Enter Card Number"
                    value={card.cardNumber}
                    onChange={(e) =>
                      handleCardChange(index, "cardNumber", e.target.value)
                    }
                    className={errors[index]?.cardNumber ? "error" : ""}
                  />
                  {errors[index]?.cardNumber && (
                    <p className="error-message">{errors[index]?.cardNumber}</p>
                  )}
                  {/* Separate inputs for month and year */}
                  <p>Expiration Month</p>
                  <input
                    type="text"
                    placeholder="MM"
                    //maxLength="2"
                    value={card.expirationMonth}
                    onChange={(e) =>
                      handleCardChange(index, "expirationMonth", e.target.value)
                    }
                    className={errors[index]?.expirationMonth ? "error" : ""}
                  />
                  {errors[index]?.expirationMonth && (
                    <p className="error-message">{errors[index]?.expirationMonth}</p>
                  )}
                  <p>Expiration Year</p>
                  <input
                    type="text"
                    placeholder="YY"
                    //maxLength="2"
                    value={card.expirationYear}
                    onChange={(e) =>
                      handleCardChange(index, "expirationYear", e.target.value)
                    }
                    className={errors[index]?.expirationYear ? "error" : ""}
                  />
                  {errors[index]?.expirationYear && (
                    <p className="error-message">{errors[index]?.expirationYear}</p>
                  )}
                  <p>CVC</p>
                  <input
                    type="text"
                    placeholder="Enter CVC"
                    value={card.cvc}
                    onChange={(e) =>
                      handleCardChange(index, "cvc", e.target.value)
                    }
                    className={errors[index]?.cvc ? "error" : ""}
                  />
                  {errors[index]?.cvc && (
                    <p className="error-message">{errors[index]?.cvc}</p>
                  )}
                  <p>Street Address</p>
                  <input
                    type="text"
                    name="streetAddress"
                    value={card.streetAddress}
                    onChange={(e) =>
                      handleCardChange(index, "streetAddress", e.target.value)
                    }
                    placeholder="Enter Street Address"
                    className={errors[index]?.streetAddress ? "error" : ""}
                  />
                  {errors[index]?.streetAddress && (
                    <p className="error-message">{errors[index]?.streetAddress}</p>
                  )}
                  <p>City</p>
                  <input
                    type="text"
                    name="city"
                    value={card.city}
                    onChange={(e) =>
                      handleCardChange(index, "city", e.target.value)
                    }
                    placeholder="Enter City"
                    className={errors[index]?.city ? "error" : ""}
                  />
                  {errors[index]?.city && (
                    <p className="error-message">{errors[index]?.city}</p>
                  )}
                  <p>State</p>
                  <input
                    type="text"
                    name="state"
                    value={card.state}
                    onChange={(e) =>
                      handleCardChange(index, "state", e.target.value)
                    }
                    placeholder="Enter State"
                    className={errors[index]?.state ? "error" : ""}
                  />
                  {errors[index]?.state && (
                    <p className="error-message">{errors[index]?.state}</p>
                  )}
                  <p>Zip Code</p>
                  <input
                    type="text"
                    name="zipCode"
                    value={card.zipCode}
                    onChange={(e) =>
                      handleCardChange(index, "zipCode", e.target.value)
                    }
                    placeholder="Enter Zip Code"
                    className={errors[index]?.zipCode ? "error" : ""}
                  />
                  {errors[index]?.zipCode && (
                    <p className="error-message">{errors[index]?.zipCode}</p>
                  )}
                  <div className="center-btn">
                    <button
                      className="remove-btn"
                      onClick={() => removeCard(index, card.id)}
                    >
                      Remove Card
                    </button>
                  </div>
                </div>
              ))}
              <div className="center-btn">
                <button className="edit-profile-btn" onClick={addCard}>
                  Add Card
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Home Address */}
        <div className="section">
          <button onClick={toggleHomeAddress} className="section-toggle">
            <span>Home Address</span>
            <span>{showHomeAddress ? "▲" : "▼"}</span>
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
                className={errors.streetAddress ? "error" : ""}
              />
              <p>City</p>
              <input
                type="text"
                name="city"
                value={userData.addressInfo.city}
                onChange={handleAddressChange}
                placeholder="Enter City"
                className={errors.city ? "error" : ""}
              />
              <p>State</p>
              <input
                type="text"
                name="state"
                value={userData.addressInfo.state}
                onChange={handleAddressChange}
                placeholder="Enter State"
                className={errors.state ? "error" : ""}
              />
              <p>Zip Code</p>
              <input
                type="text"
                name="zipCode"
                value={userData.addressInfo.zipCode}
                onChange={handleAddressChange}
                placeholder="Enter Zip Code"
                className={errors.zipCode ? "error" : ""}
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
            <p className="opted-in">
              You are currently registered for promotions.
            </p>
          ) : (
            <p className="opted-out">You are not registered for promotions.</p>
          )}
        </div>

        <div className="center-btn">
          <button className="edit-profile-btn" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
        
        {successMessage && <p className="success">{successMessage}</p>}
        {errors.api && <p className="error">{errors.api}</p>}
      </div>
    </div>
  );
};

export default EditProfile;
