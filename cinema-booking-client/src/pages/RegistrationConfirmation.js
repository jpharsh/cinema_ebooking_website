import React, { useState } from 'react';
import './RegistrationConfirmation.css'; // Ensure the styles are imported
import axios from 'axios';  // Import Axios to send requests
import { useNavigate, useLocation } from 'react-router-dom'; // Import hooks for navigation and getting passed data
// import Navbar from '../components/Navbar';
// import Header from '../components/Header'; // Import the Header component


const RegistrationConfirmation = () => {
  // State to manage the verification code input fields
  const [code, setCode] = useState(new Array(5).fill(""));
  const [errorMessage, setErrorMessage] = useState('');  // For handling error messages
  const navigate = useNavigate();  // Hook to navigate after successful verification
  const location = useLocation();  // Hook to get the email passed from the registration page
  const email = location.state?.email;  // Access the passed email

  // Handle input change
  const handleChange = (e, index) => {
    const value = e.target.value;
    // Allow only one numeric value per input box
    if (/^\d$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input box if there's a next one
      if (index < 4) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newCode = [...code];

      // If the current input is empty, move to the previous input
      if (newCode[index] === "") {
        if (index > 0) {
          document.getElementById(`code-input-${index - 1}`).focus();
        }
      } else {
        // If the current input has a value, clear it and stay on the same input
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  // Handle form submission and send verification code to the backend ####!!!!!!!!!!!!
  const handleSubmit = async () => {
    try {
      const verificationCode = code.join("");  // Combine the array into a single string
      console.log("Email:", email);
      console.log("Verification code:", verificationCode); 
      const response = await axios.post('http://127.0.0.1:5000/api/verify-account', {
        email,  // Email passed from the registration page
        verificationCode
      });

      if (response.status === 200) {
        // Verification successful, navigate to the success page or login page
        navigate('/registration-checkmark');
      }
    } catch (error) {
      // Handle error if verification fails
      setErrorMessage('Verification failed. Please check the code and try again.');
    }
  };

  return (
    <div>
      {/*<Navbar />*/}
      <div className="order-summary-container">
        {/* <Header /> */}
        <h2 className="verification-title">Verify Your Account</h2>
        <div className="verification-details">
          <p>
            A verification code was sent to your email. Please verify your
            account to finish registering your account.
          </p>
          <div className="verification-code-inputs">
            {code.map((num, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                maxLength="1"
                className="verification-input"
                value={num}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)} // Handle backspace key press
              />
            ))}
          </div>
          <button className="confirm-button" onClick={handleSubmit}>Confirm</button>
          {/* Display error message if verification fails */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          
          {/* You can also conditionally show a success message if needed */}
        </div>
      </div>
    </div>
  );
};

export default RegistrationConfirmation;