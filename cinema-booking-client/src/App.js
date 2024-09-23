import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieList from './components/MovieList';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage.js';
import SelectTickets from './pages/SelectTickets.js';
import PaymentInfo from './pages/PaymentInfo.js';
import SelectSeats from './pages/SelectSeats.js';
import LoginPage from './pages/LoginPage.js';
import EditProfile from './pages/EditProfile.js';
import OrderSummary from './pages/OrderSummary.js';
import Registration from './pages/Registration.js';
import RegistrationConfirmation from './pages/RegistrationConfirmation.js';
import OrderConfirmation from './pages/OrderConfirmation.js';
import axios from 'axios';
import './App.css';





function App() {
return (
  <Router>
    <div className="App">
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/select-tickets" element={<SelectTickets />} />
        <Route path="/select-seats" element={<SelectSeats />} />
        <Route path="/payment-info" element={<PaymentInfo />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/registration-confirmation" element={<RegistrationConfirmation />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
    </div>
  </Router>
);
}




export default App;
