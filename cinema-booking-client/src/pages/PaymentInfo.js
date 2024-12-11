import React from "react";
import "./PaymentInfo.css";
import MasterCardLogo from "../images/MasterCardLogo.png";
import VisaLogo from "../images/VisaLogo.png";
import AmexLogo from "../images/AmericanExpressLogo.png";
import DiscoverLogo from "../images/DiscoverLogo.png";
import DefaultCardLogo from "../images/DefaultCardLogo.png";
// import LoggedInNavbar from '../components/LoggedInNavbar';
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const PaymentInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    adultCount,
    childCount,
    seniorCount,
    totalPrice,
    movie,
    formattedSeats,
    tickets,
  } = location.state || {};
  //   const seats = formattedSeats.map(seat => `Row ${seat.row + 1}, Seat ${seat.col + 1}`);
  const [promoCode, setPromoCode] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(totalPrice);
  const [promoError, setPromoError] = useState("");
  const [promoId, setPromoId] = useState("");

  const seats = formattedSeats.map((seat) => {
    const rowLetter = String.fromCharCode(65 + seat.row); // Convert row index to letter (A = 65 in ASCII)
    const seatNumber = seat.col + 1;
    return `${rowLetter}${seatNumber}`;
  });
  const date = location.state?.date;
  const time = location.state?.time;
  const showid = location.state?.showid;
  const userSeats = location.state?.userSeats;

  const [cards, setCards] = useState([]);
  useEffect(() => {
    // Fetch saved cards from the backend
    const fetchCards = async () => {
      const userId = await fetchUserId();

      if (!userId) {
        console.error("User is not logged in or session is invalid.");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        // Fetch card information
        const cardResponse = await axios.get(
          `http://127.0.0.1:5000/api/cards-get?user_id=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const cardData = cardResponse.data;
        console.log("Card data:", cardData);
        if (cardData.found) {
          setCards(
            cardData.card_data.map((card) => ({
              id: card.id,
              nameOnCard: card.name_on_card,
              cardNumber: card.card_num,
              expirationMonth: card.exp_month,
              expirationYear: card.exp_year,
              cvc: card.cv_num,
              streetAddress: card.street_address,
              city: card.city,
              state: card.state,
              zipCode: card.zip_code,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching payment cards:", error);
      }
    };

    fetchCards();
  }, []);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardInfo, setCardInfo] = useState({
    nameOnCard: "",
    cardNumber: "",
    expirationDate: "",
    cvc: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [canProceed, setCanProceed] = useState(false); // Add state for proceed button
  // Function to validate card info

  // UseEffect to update canProceed
  useEffect(() => {
    if (selectedCard || isCardInfoValid()) {
      setCanProceed(true);
    } else {
      setCanProceed(false);
    }
  }, [selectedCard, cardInfo]); // Re-run effect when these dependencies change

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  if (!totalPrice) {
    return <p>No price available</p>;
  }

  async function fetchUserId() {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found, user is not logged in.");
      return null; // Return null if no token is available
    }

    try {
      // Make the request with the Authorization header
      const response = await axios.get(
        "http://127.0.0.1:5000/api/check-session",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Extract only the user_id if the user is logged in
      if (response.data.logged_in) {
        const user_id = response.data.user_id;
        console.log("User ID:", user_id); // Debugging line
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

  const handleCancel = () => {
    navigate("/select-tickets", {
      state: { movie, formattedSeats, date, time, showid },
    });
  };

  const validateCardNumber = (cardNumber) => {
    // Simple regex for card number validation
    const cardNumberPattern = /^[0-9]{16}$/;
    return cardNumberPattern.test(cardNumber);
  };

  const validateExpirationDate = (expirationDate) => {
    console.log("The EXPIRATION DATE: ", expirationDate);
    // Simple regex for expiration date validation
    const expirationDatePattern = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;

    return expirationDatePattern.test(expirationDate);
  };

  const validateCVC = (cvc) => {
    // Simple regex for cvc validation
    console.log("The CVC: ", cvc);
    const cvcPattern = /^[0-9]{3}$/;
    return cvcPattern.test(cvc);
  };

  const isCardInfoValid = () => {
    return (
      cardInfo.nameOnCard &&
      cardInfo.cardNumber &&
      validateCardNumber(cardInfo.cardNumber) &&
      cardInfo.expirationDate &&
      validateExpirationDate(cardInfo.expirationDate) &&
      cardInfo.cvc &&
      validateCVC(cardInfo.cvc) &&
      cardInfo.streetAddress &&
      cardInfo.city &&
      cardInfo.state &&
      cardInfo.zipCode
    );
  };

  const handleCardChange = (field, value) => {
    // Update the cards array based on the index
    const updatedCards = [...cards];
    updatedCards[field] = value;
    setCards(updatedCards);

    // Dynamically update the correct field in formData.cardInfo
    setCardInfo((prevCardInfo) => ({
      ...prevCardInfo,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleAddCard = async (e) => {
    if (e) {
      e.preventDefault();
    }

    let cardError = {};
    if (!cardInfo.nameOnCard) cardError.nameOnCard = "Name is required";
    if (!cardInfo.cardNumber || !validateCardNumber(cardInfo.cardNumber))
      cardError.cardNumber = "Card Number must be a 16-digit number";
    if (
      !cardInfo.expirationDate ||
      !validateExpirationDate(cardInfo.expirationDate)
    )
      cardError.expirationDate = "Expiration Date must be in MM/YY format";
    if (!cardInfo.cvc || !validateCVC(cardInfo.cvc))
      cardError.cvc = "CVC must be a 3-digit number";
    if (!cardInfo.streetAddress)
      cardError.streetAddress = "Street Address is required";
    if (!cardInfo.city) cardError.city = "City is required";
    if (!cardInfo.state) cardError.state = "State is required";
    if (!cardInfo.zipCode || isNaN(cardInfo.zipCode))
      cardError.zipCode = "Zip Code must be a number";

    const hasErrors = Object.keys(cardError).length > 0;
    if (hasErrors) {
      setErrors(cardError);
      console.log("Errors:", cardError);
      return; // Stop the form submission if there are any card errors
    }

    const userId = await fetchUserId();
    const dataToSend = {
      ...cardInfo,
      user_id: userId,
    };
    console.log("Data to send:", dataToSend);
    try {
      await axios
        .post("http://127.0.0.1:5000/api/add-card", dataToSend)
        .then((response) => {
          if (response.status === 200) {
            setSuccessMessage("Added card successfully.");
          }
        });
    } catch (e) {
      console.error("Error adding card:", e);
    }
  };

  const handleApplyPromo = async () => {
        try {
            // Send promo code to backend for validation
            const response = await axios.post(
                "http://127.0.0.1:5000/api/validate-promo",
                { promo_code: promoCode }
            );
    
            // Handle successful validation
            if (response.status === 200 && response.data.discount) {
                const discountAmount = response.data.discount;
    
                // Calculate the new discounted price
                const newDiscountedPrice =
                    discountAmount === 100
                        ? 0 // Full discount means price is free
                        : (totalPrice * (100 - discountAmount)) / 100;
    
                setDiscountedPrice(newDiscountedPrice); // Update discounted price
                setPromoError(""); // Clear any existing promo errors
            } else {
                // Handle unexpected response structure
                setPromoError(response.data.error || "Invalid promo code.");
            }
        } catch (error) {
            // Handle errors from the backend or network
            if (error.response) {
                if (error.response.status === 404) {
                    setPromoError("Invalid promo code. Please try again.");
                } else if (error.response.status === 400) {
                    setPromoError(error.response.data.error || "Invalid request.");
                } else {
                    setPromoError("An unexpected error occurred. Please try again.");
                }
            } else {
                setPromoError("Unable to connect to the server. Please try again.");
            }
    
            // Log the error for debugging purposes
            console.error("Error applying promo code:", error);
        }
    };

  return (
    <div>
      {/*<LoggedInNavbar />*/}
      <div
        className="movie-section"
        style={{ width: "50%", alignContent: "center", padding: "30px" }}
      >
        <h2 style={{ marginTop: "0px", textAlign: "left" }}>Payment Info</h2>

        {cards.length > 0 && (
          <div className="saved-cards-container">
            <div className="first-row">
              <h3>Select Saved Card</h3>
              <p className="small-text" style={{ paddingLeft: "13%" }}>
                Name
              </p>
              <p className="small-text">Expiration Date</p>
            </div>

            <div className="card-rows">
              {cards.map((card) => (
                <button
                  key={card.id}
                  className="card"
                  onClick={() => setSelectedCard(card.id)} // Update selected card
                  style={{
                    backgroundColor:
                      selectedCard === card.id ? "#555" : "#353535",
                  }}
                >
                  <div className="card-info">
                    <div className="card-type" style={{ width: "31%" }}>
                      {/* starts with 4 = visa, starts with 2 or 5 = mastercard, starts with 3 = amex, starts with 6 = discover, else default */}

                      {card.cardNumber.toString().startsWith("4") ? (
                        <div className="card-type">
                          <img
                            src={VisaLogo}
                            alt="Visa Logo"
                            className="card-logo"
                          />
                          <h4>Visa</h4>
                        </div>
                      ) : card.cardNumber.toString().startsWith("5") ||
                        card.cardNumber.toString().startsWith("2") ? (
                        <div className="card-type">
                          <img
                            src={MasterCardLogo}
                            alt="MasterCard Logo"
                            className="card-logo"
                          />
                          <h4>MasterCard</h4>
                        </div>
                      ) : card.cardNumber.toString().startsWith("3") ? (
                        <div className="card-type">
                          <img
                            src={AmexLogo}
                            alt="Amex Logo"
                            className="card-logo"
                          />
                          <h4>Amex</h4>
                        </div>
                      ) : card.cardNumber.toString().startsWith("6") ? (
                        <div className="card-type">
                          <img
                            src={DiscoverLogo}
                            alt="Discover Logo"
                            className="card-logo"
                          />
                          <h4>Discover</h4>
                        </div>
                      ) : (
                        <div className="card-type">
                          <img
                            src={DefaultCardLogo}
                            alt="Default Card Logo"
                            className="card-logo"
                          />
                          <h4>Card</h4>
                        </div>
                      )}

                      <p className="small-text">
                        ending in {card.cardNumber.toString().slice(-4)}
                      </p>
                    </div>

                    <p style={{ marginRight: "20px" }}> {card.nameOnCard}</p>
                    <p style={{ display: "flex", justifyContent: "end" }}>
                      {" "}
                      {card.expirationMonth}/{card.expirationYear}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        <h3 style={{ paddingTop: "20px" }}>Enter Payment Info</h3>
        <div className="payment-info-container">
          <div className="payment-info" style={{ width: "50%" }}>
            <label>Name on Card</label>
            <input
              className={errors?.nameOnCard ? "error" : ""}
              type="text"
              onChange={(e) => handleCardChange("nameOnCard", e.target.value)}
            />
            {errors.nameOnCard && (
              <p className="payment-error-message">{errors.nameOnCard}</p>
            )}
          </div>
          <div className="payment-info" style={{ width: "60%" }}>
            <label>Card Number</label>
            <input
              className={errors?.cardNumber ? "error" : ""}
              type="text"
              onChange={(e) => handleCardChange("cardNumber", e.target.value)}
            />
            {errors.cardNumber && (
              <p className="payment-error-message">{errors.cardNumber}</p>
            )}
          </div>
          <div className="payment-info" style={{ width: "40%" }}>
            <label>Expiration Date</label>
            <input
              className={errors?.expirationDate ? "error" : ""}
              type="text"
              onChange={(e) =>
                handleCardChange("expirationDate", e.target.value)
              }
            />
            {errors.expirationDate && (
              <p className="payment-error-message">{errors.expirationDate}</p>
            )}
          </div>
          <div className="payment-info" style={{ width: "25%" }}>
            <label>CVV/CVC</label>
            <input
              className={errors?.cvc ? "error" : ""}
              type="text"
              onChange={(e) => handleCardChange("cvc", e.target.value)}
            />
            {errors.cvc && (
              <p className="payment-error-message">{errors.cvc}</p>
            )}
          </div>
        </div>
        <h3 style={{ paddingTop: "10px" }}>Enter Billing Address</h3>
        <div className="payment-info-container">
          <div className="payment-info" style={{ width: "40%" }}>
            <label>Street Address</label>
            <input
              className={errors?.streetAddress ? "error" : ""}
              type="text"
              onChange={(e) =>
                handleCardChange("streetAddress", e.target.value)
              }
            />
            {errors.streetAddress && (
              <p className="payment-error-message">{errors.streetAddress}</p>
            )}
          </div>
          <div className="payment-info" style={{ width: "30%" }}>
            <label>City</label>
            <input
              className={errors?.city ? "error" : ""}
              type="text"
              onChange={(e) => handleCardChange("city", e.target.value)}
            />
            {errors.city && (
              <p className="payment-error-message">{errors.city}</p>
            )}
          </div>
          <div className="payment-info" style={{ width: "15%" }}>
            <label>State</label>
            <input
              className={errors?.state ? "error" : ""}
              type="text"
              onChange={(e) => handleCardChange("state", e.target.value)}
            />
            {errors.state && (
              <p className="payment-error-message">{errors.state}</p>
            )}
          </div>
          <div className="payment-info" style={{ width: "20%" }}>
            <label>Zip Code</label>
            <input
              className={errors?.zipCode ? "error" : ""}
              type="text"
              onChange={(e) => handleCardChange("zipCode", e.target.value)}
            />
            {errors.zipCode && (
              <p className="payment-error-message">{errors.zipCode}</p>
            )}
          </div>
        </div>
        {cards.length < 3 && (
          <button
            className="red btn"
            style={{
              marginTop: "5px",
              display: "flex",
              alignSelf: "flex-start",
            }}
            onClick={handleAddCard}
          >
            Add Your Card
          </button>
        )}

        <h3 style={{ paddingTop: "20px" }}>Enter Promo Codes</h3>
        <div
          className="payment-info"
          style={{ marginTop: "20px", gap: "10px" }}
        >
          <div>
            <label>Promo Code </label>
            <span className="small-text">(optional)</span>
          </div>

          <input
            className="input-box"
            style={{ width: "150px", marginBottom: "0px" }}
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promo code"
          />

          <div
            style={{
              width: "97%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              className="red btn"
              style={{ height: "100%" }}
              onClick={handleApplyPromo}
            >
              Apply Promo
            </button>
            {/* Error message display */}
            {promoError && <p style={{ color: "red", marginTop: "8px" }}>{promoError}</p>}
            <div>
              {/* Payment Details */}
              <div className="payment-row">
                <span className="payment-title">Subtotal:</span>
                <span className="payment-value">${totalPrice}</span>
              </div>
              <div className="payment-row">
                <span className="payment-title">Sales Tax:</span>
                <span className="payment-value">
                  ${(totalPrice * 0.07).toFixed(2)}
                </span>
              </div>
              <div className="payment-row">
                <span className="payment-title">Online Fee:</span>
                <span className="payment-value">$2.00</span>
              </div>

              {/* Discounted Price */}
              {discountedPrice !== totalPrice && (
                <div className="payment-row">
                  <span className="payment-title">Discount Applied:</span>
                  <span className="payment-value">
                    -${(totalPrice - discountedPrice).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Total Price */}
              <div className="payment-row total-row">
                <span className="payment-title">Total:</span>
                <span className="payment-value">
                  {/* Use discountedPrice if available, otherwise use ticketPrice */}
                  {discountedPrice !== undefined
                    ? discountedPrice === 0
                      ? (discountedPrice + discountedPrice * 0.07 + 2).toFixed(
                          2
                        ) // Handle 100% discount (free)
                      : (discountedPrice + discountedPrice * 0.07 + 2).toFixed(
                          2
                        ) // Regular discounted price calculation
                    : (totalPrice + totalPrice * 0.07 + 2).toFixed(2)}{" "}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-container">
          <button className="btn white" onClick={handleCancel}>
            Cancel
          </button>
          <button
             className="btn red"
             disabled={!canProceed} // Disable button if canProceed is false
             onClick={() => {
               const priceToUse = discountedPrice !== undefined ? discountedPrice : totalPrice; // Use discountedPrice if available, otherwise fall back to totalPrice
               const salesTax = priceToUse * 0.07; // Calculate sales tax (7%)
               const onlineFee = 2.0; // Flat online fee
               const finalTotalPrice = priceToUse + salesTax + onlineFee; // Calculate final total


               navigate("/order-summary", {
                 state: {
                   tickets: {
                     adults: adultCount,
                     children: childCount,
                     seniors: seniorCount,
                   },
                   totalPrice: finalTotalPrice, // Pass the final total price (promo price if applied)
                   seats, // Pass the selected seats
                   date,
                   time,
                   movie,
                   userSeats,
                   showid,
                   selectedCard,
                  promoCode
                },
               });
             }}
           >
             Continue To Checkout
         </button>
        </div>
        {movie.title}
        <div>
          <h3>Selected Seats:</h3>
          <ul>
            {seats.map((seat, index) => (
              <li key={index}>{seat}</li> // Each seat is rendered as a list item
            ))}
          </ul>
          <p>Date: {date}</p>
          <p>Time: {time}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
