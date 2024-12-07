import React, { useState, useEffect } from 'react';
import './EditProfile.css';
// import Navbar from '../components/Navbar';
// import Header from '../components/Header'; // Import the Header component
import axios from 'axios'; // Axios for sending data to the server
import { useNavigate } from 'react-router-dom'; // Hook for navigation




const Registration = () => {
 // States to control the visibility of sections
 const [showRequiredInfo, setShowRequiredInfo] = useState(true);
 const [showPaymentInfo, setShowPaymentInfo] = useState(false);
 const [showHomeAddress, setShowHomeAddress] = useState(false);
 const [showCard, setShowCard] = useState([false, false, false]);
 const [cards, setCards] = useState([{ id: 1, nameOnCard: '', cardNumber: '', expirationDate: '', cvc: '', streetAddress: '', city: '', state: '', zipCode: '' }]);
 const navigate = useNavigate(); // Hook for navigation




 // Functions to toggle sections
 const toggleRequiredInfo = () => setShowRequiredInfo(!showRequiredInfo);
 const togglePaymentInfo = () => setShowPaymentInfo(!showPaymentInfo);
 const toggleHomeAddress = () => setShowHomeAddress(!showHomeAddress);
 const toggleCard = (index) => {
  setShowCard(showCard.map((card, i) => (i === index ? !card : card))); // Toggle only the selected card
  };




 const [showAddressPopup, setShowAddressPopup] = useState(false);
 const [showCardPopup, setShowCardPopup] = useState(false);
//    const [showPopup, setShowPopup] = useState(false);
 const [continueWithoutInfo, setContinueWithoutInfo] = useState(false);




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




  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');




  let formErrors = {};
  // Form validation logic
  const validateForm = () => {
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




  const validateExpirationDate = (expirationDate) => {
      // Simple regex for expiration date validation
      const expirationDatePattern = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
      return expirationDatePattern.test(expirationDate);
  };




  const validateCVC = (cvc) => {
      // Simple regex for cvc validation
      const cvcPattern = /^[0-9]{3}$/;
      return cvcPattern.test(cvc);
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




      if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
          formErrors.phoneNumber = 'Phone Number must be a 10-digit number (no spaces or dashes)';
      }




      if (showPaymentInfo) {
           const cardErrors = [];
           cards.forEach((card, index)=> {
               let cardError = {};
           if (!card.nameOnCard) cardError.nameOnCard = 'Name on Card is required';
           if (!card.cardNumber || !validateCardNumber(card.cardNumber)) cardError.cardNumber = 'Card Number must be a 16-digit number';
           if (!card.expirationDate || !validateExpirationDate(card.expirationDate)) cardError.expirationDate = 'Expiration Date must be in MM/YY format';
           if (!card.cvc || !validateCVC(card.cvc)) cardError.cvc = 'CVC must be a 3-digit number';
           if (!card.streetAddress) cardError.streetAddress = 'Street Address is required';
           if (!card.city) cardError.city = 'City is required';
           if (!card.state) cardError.state = 'State is required';
           if (!card.zipCode || isNaN(card.zipCode)) cardError.zipCode = 'Zip Code must be a number';


           // if there are any errors for this card, add them to cardErrors array
           cardErrors.push(cardError);
           });
           // Check if any card has errors and prevent form submission
       const hasCardErrors = cardErrors.some(cardError => Object.keys(cardError).length > 0);


       if (hasCardErrors) {
           setErrors(cardErrors); // Set errors for each card
           return; // Stop the form submission if there are any card errors
       }
  


         /* if (formData.cardInfo.cardNumber && !validateCardNumber(formData.cardInfo.cardNumber)) {
              formErrors.cardNumber = 'Card Number must be a 16-digit number';
          }
          if (formData.cardInfo.expirationDate && !validateExpirationDate(formData.cardInfo.expirationDate)) {
              formErrors.expirationDate = 'Expiration Date must be in MM/YY format';
          }
          if (formData.cardInfo.cvc && !validateCVC(formData.cardInfo.cvc)) {
              formErrors.cvc = 'CVC must be a 3-digit number';
          }
          if (formData.cardInfo.zipCode && isNaN(formData.cardInfo.zipCode)) {
              formErrors.billingZipCode = 'Zip Code must be a number';
          }*/


      } //if showpaymentinfo


      setErrors(formErrors);
      console.log('Form Errors:', formErrors);
      console.log('Form Data:', formData);
      if (Object.keys(formErrors).length === 0) {
          if (formData.cardInfo.nameOnCard || formData.cardInfo.cardNumber || formData.cardInfo.expirationDate || formData.cardInfo.cvc || formData.cardInfo.streetAddress || formData.cardInfo.city || formData.cardInfo.state || formData.cardInfo.zipCode) {
              if (!formData.cardInfo.nameOnCard || !formData.cardInfo.cardNumber || !formData.cardInfo.expirationDate || !formData.cardInfo.cvc || !formData.cardInfo.streetAddress || !formData.cardInfo.city || !formData.cardInfo.state || !formData.cardInfo.zipCode) {
                  setShowCardPopup(true);  // Show popup if the card info is incomplete
                  return;
              }
          }
        
          if (formData.addressInfo.streetAddress || formData.addressInfo.city || formData.addressInfo.state || formData.addressInfo.zipCode) {
              if (!formData.addressInfo.streetAddress || !formData.addressInfo.city || !formData.addressInfo.state || !formData.addressInfo.zipCode) {
                  setShowAddressPopup(true);  // Show popup if the address is incomplete
                  return;
              }
          }
          try {
              // Send data to the server
              const dataToSend = {
                  ...formData,
                  cards: cards // Include the array of cards
              };
       
              await axios.post('http://127.0.0.1:5000/api/register', dataToSend)
              .then(response => {
                  console.log('Response:', response.data);
                  if (response.status === 200) {
                      setSuccessMessage("Registration successful! Please check your email for confirmation.");
                      let email = formData.email;
                      console.log('Email in registration.js:', email);
                      navigate('/registration-confirmation', { state: { email } });
                  }
              });
        
          } catch (e) {
              console.error("Error registering the user:", e);
        
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


  const handleCloseAddressPopup = (continueWithoutInfo) => {
      setShowAddressPopup(false);
      setContinueWithoutInfo(continueWithoutInfo);




      if (continueWithoutInfo) {
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




  const handleCloseCardPopup = (continueWithoutInfo) => {
      setShowCardPopup(false);
      setContinueWithoutInfo(continueWithoutInfo);
       if (continueWithoutInfo) {
          // Clear all card info if the user chooses to continue without info
          setCards([{ id: 1, nameOnCard: '', cardNumber: '', expirationDate: '', cvc: '', streetAddress: '', city: '', state: '', zipCode: '' }]);
          setErrors([]); // Clear errors if the user continues without card info
      } else {
          // Initialize an empty array to store errors for each card
          const cardErrors = cards.map((card) => ({
              nameOnCard: card.nameOnCard ? '' : 'Name on Card is required',
              cardNumber: card.cardNumber ? '' : 'Card Number is required',
              expirationDate: card.expirationDate ? '' : 'Expiration Date is required',
              cvc: card.cvc ? '' : 'CVC is required',
              streetAddress: card.streetAddress ? '' : 'Street Address is required',
              city: card.city ? '' : 'City is required',
              state: card.state ? '' : 'State is required',
              zipCode: card.zipCode ? '' : 'Zip Code is required',
          }));
           // Check if there are any errors in any card
          const hasErrors = cardErrors.some(error =>
              Object.values(error).some(errorMessage => errorMessage !== '')
          );
           // If there are errors, update the state to show the errors for each card
          if (hasErrors) {
              setErrors(cardErrors);  // Set errors for each card
          } else {
              setErrors([]);  // Clear errors if no errors found
          }
      }




  };




  useEffect(() => {
      if (continueWithoutInfo) {
          handleSubmit(); // Now that address info is cleared, submit the form
          setContinueWithoutInfo(false); // Reset after submission
      }
  }, [continueWithoutInfo, formData]); // Listen for changes in formData and continueWithoutInfo




  const addNewCard = () => {
   if (cards.length < 3) {
       // Add a new card with empty values
       setCards((prevCards) => [
           ...prevCards,
           {
               id: prevCards.length + 1,
               nameOnCard: '',
               cardNumber: '',
               expirationDate: '',
               cvc: '',
               streetAddress: '',
               city: '',
               state: '',
               zipCode: ''
           }
       ]);


       // Add an empty error object for the new card (ensures no errors are carried over)
       setErrors((prevErrors) => [
           ...prevErrors,
           {
               nameOnCard: '',
               cardNumber: '',
               expirationDate: '',
               cvc: '',
               streetAddress: '',
               city: '',
               state: '',
               zipCode: ''
           }
       ]);
   }
};




   const handleCardChange = (index, field, value) => {
      // Update the cards array based on the index
      const updatedCards = [...cards];
      updatedCards[index][field] = value;
      setCards(updatedCards);




      // Dynamically update the correct field in formData.cardInfo
      setFormData((prevFormData) => ({
          ...prevFormData,
          cardInfo: {
              ...prevFormData.cardInfo,
              [field]: value
          }
      }));
  };




  const handleRemoveCard = (index) => {
   if (cards.length > 1) {
       const updatedCards = cards.filter((_, i) => i !== index);
       setCards(updatedCards);


       // Remove the corresponding errors for the deleted card
       const updatedErrors = errors.filter((_, i) => i !== index);
       setErrors(updatedErrors);
   }
};




 return (

   
        // <div>
        //   <div className="registration-container">
        //     <h1>Edit Profile</h1>
    
        //     {/* Personal Information */}
        //     <div className="section">
        //       <button onClick={toggleRequiredInfo} className="section-toggle">
        //         <span>Personal Information</span>
        //         <span>{showRequiredInfo ? "▲" : "▼"}</span>
        //       </button>
        //       {showRequiredInfo && (
  <div>
      {/*<Navbar />*/}
      <div className="registration-container">
          <h1>Create Profile</h1>




          <form className="registration-form" onSubmit={handleSubmit}>
          {/* Required Information */}
          <div className="section">
              <button type="button" onClick={toggleRequiredInfo} className="section-toggle">
                  <span>Required Information</span> 
                  <span>{showRequiredInfo ? "▲" : "▼"}</span> 
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
          {/* Toggle for Cards */}
          {cards.map((card, index) => (
              <div key={index} className="section">
                  <button type="button" onClick={() => toggleCard(index)} className="section-toggle">
                      <span>Card {index + 1}</span>
                      <span>{showCard[index] ? '▲' : '▼'}</span>
                  </button>




                  {showCard[index] && (
                      <div className="section-content">
                          <p>Name on Card</p>
                          <input
                              type="text"
                              name="nameOnCard"
                              value={card.nameOnCard}
                              onChange={(e) => handleCardChange(index, 'nameOnCard', e.target.value)}
                              className={errors[index]?.nameOnCard ? 'error' : ''}
                          />
                          {errors[index]?.nameOnCard && <p className="error-message">{errors[index]?.nameOnCard}</p>}




                          <p>Card Number</p>
                          <input
                              type="text"
                              name="cardNumber"
                              value={card.cardNumber}
                              onChange={(e) => handleCardChange(index, 'cardNumber', e.target.value)}
                              className={errors[index]?.cardNumber ? 'error' : ''}
                          />
                          {errors[index]?.cardNumber && <p className="error-message">{errors[index]?.cardNumber}</p>}




                          <p>Expiration Date</p>
                          <input
                              type="text"
                              name="expirationDate"
                              value={card.expirationDate}
                              onChange={(e) => handleCardChange(index, 'expirationDate', e.target.value)}
                              className={errors[index]?.expirationDate ? 'error' : ''}
                          />
                          {errors[index]?.expirationDate && <p className="error-message">{errors[index]?.expirationDate}</p>}




                          <p>CVC</p>
                          <input
                              type="text"
                              name="cvc"
                              value={card.cvc}
                              onChange={(e) => handleCardChange(index, 'cvc', e.target.value)}
                              className={errors[index]?.cvc ? 'error' : ''}
                          />
                          {errors[index]?.cvc && <p className="error-message">{errors[index]?.cvc}</p>}




                          <p>Street Address</p>
                          <input
                              type="text"
                              name="streetAddress"
                              value={card.streetAddress}
                              onChange={(e) => handleCardChange(index, 'streetAddress', e.target.value)}
                              className={errors[index]?.streetAddress ? 'error' : ''}
                          />
                          {errors[index]?.streetAddress && <p className="error-message">{errors[index]?.streetAddress}</p>}




                          <p>City</p>
                          <input
                              type="text"
                              name="city"
                              value={card.city}
                              onChange={(e) => handleCardChange(index, 'city', e.target.value)}
                              className={errors[index]?.city ? 'error' : ''}
                          />
                          {errors[index]?.city && <p className="error-message">{errors[index]?.city}</p>}




                          <p>State</p>
                          <input
                              type="text"
                              name="state"
                              value={card.state}
                              onChange={(e) => handleCardChange(index, 'state', e.target.value)}
                              className={errors[index]?.state ? 'error' : ''}
                          />
                          {errors[index]?.state && <p className="error-message">{errors[index]?.state}</p>}




                          <p>Zip Code</p>
                          <input
                              type="text"
                              name="zipCode"
                              value={card.zipCode}
                              onChange={(e) => handleCardChange(index, 'zipCode', e.target.value)}
                              className={errors[index]?.zipCode ? 'error' : ''}
                          />
                          {errors[index]?.zipCode && <p className="error-message">{errors[index]?.zipCode}</p>}




                          <div className="center-btn">
                              <button type="button" className="btn white" onClick={() => handleRemoveCard(index)}>Remove Card</button>
                          </div>
                      </div>
                  )}
              </div>
          ))}
          <div className="center-btn">
              <button
                  type="button"
                  className="btn red"
                  onClick={addNewCard}
                  disabled={cards.length >= 3} // disable if 3 cards are already added
              >
                  + Add New Card
              </button>
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
                          className={errors.homeStreetAddress ? 'error' : ''}
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
                          className={errors.homeCity ? 'error' : ''}
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
                          className={errors.homeState ? 'error' : ''}
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
                          className={errors.homeZipCode ? 'error' : ''}
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
          {showAddressPopup && (
              <div className="popup-overlay">
                  <div className="popup">
                      <p>Your home address information is incomplete. Would you like to continue editing or create account without address information?</p>
                      <button className="btn white" onClick={() => handleCloseAddressPopup(false)}>Go Back</button>
                      <button className="btn red" onClick={() => { handleCloseAddressPopup(true) }}>Create Account</button>
                  </div>
              </div>
          )}
          {showCardPopup && (
              <div className="popup-overlay">
                  <div className="popup">
                      <p>Your payment card information is incomplete. Would you like to continue editing or create account without card information?</p>
                      <button className="btn white" onClick={() => handleCloseCardPopup(false)}>Go Back</button>
                      <button className="btn red" onClick={() => { handleCloseCardPopup(true) }}>Create Account</button>
                  </div>
              </div>
          )}
      </div>
  </div>
 );
};




export default Registration;
