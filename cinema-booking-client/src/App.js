import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieList from './components/MovieList';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage.js';
import SelectTickets from './pages/SelectTickets.js';
import PaymentInfo from './pages/PaymentInfo.js';
import SelectSeats from './pages/SelectSeats.js';
import Registration from './pages/Registration.js';
import RegistrationConfirmation from './pages/RegistrationConfirmation.js';
import RegistrationCheckmark from './pages/RegistrationCheckmark.js';
import EditProfile from './pages/EditProfile.js';
import LoginPage from './pages/LoginPage.js';
import OrderConfirmation from './pages/OrderConfirmation.js';
import OrderSummary from './pages/OrderSummary.js';
import ManageMovies from './pages/ManageMovies.js';
import AdminPage from './pages/AdminPage.js';
import Showtimes from './pages/Showtimes.js';
import Promo from './pages/Promo.js';
import axios from 'axios';
import './App.css';


function App() {
  return (
    <Router>
      
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/select-tickets" element={<SelectTickets />} />
          <Route path="/select-seats" element={<SelectSeats />} />
          <Route path="/payment-info" element={<PaymentInfo />} />
          <Route path="/registration-checkmark" element={<RegistrationCheckmark />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/registration-confirmation" element={<RegistrationConfirmation />} />
          <Route path="/manage-movies" element={<ManageMovies />} />
          <Route path="/admin-home" element={<AdminPage />} />
          <Route path="/showtimes" element={<Showtimes />} />
          <Route path="/promo" element={<Promo />} />
        </Routes>

    </Router>
  );
}


export default App;
