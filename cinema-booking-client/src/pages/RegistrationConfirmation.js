import React, { useState } from 'react';
import './RegistrationConfirmation.css'; // Ensure the styles are imported
// import Navbar from '../components/Navbar';
// import Header from '../components/Header'; // Import the Header component
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegistrationConfirmation = () => {
  const navigate = useNavigate();

  // State to manage the verification code input fields
  const [code, setCode] = useState(new Array(5).fill(""));

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

  const handleConfirm = async() => {
    // const verificationCode = code.join(''); // Join the code array into a string

    // try {
    //   // Send the code and email to the backend for verification
    //   // const response = await axios.post('/verify-account', {
    //   //   email: userEmail,
    //   //   verificationCode,
    //   // });
    //   const response = await axios.post('/verify-account', { code: code.join('') });

    //   if (response.data.success) {
    //     // CHANGE USER STATUS TO ACTIVE

    //     navigate('/registration-checkmark');
    //   } else {
    //     alert('Invalid verification code. Please try again. ', response.data.message);
    //   }
    // } catch (error) {
    //   console.error('Error verifying code', error);
    //   alert('An error occurred. Please try again later.');
    // }
      navigate('/registration-checkmark');
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
          <button onClick={handleConfirm} className="confirm-button">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationConfirmation;
