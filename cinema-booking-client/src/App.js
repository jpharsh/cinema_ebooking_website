import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieList from './components/MovieList';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage.js';
import SelectTickets from './pages/SelectTickets.js';
import PaymentInfo from './pages/PaymentInfo.js';
import SelectSeats from './pages/SelectSeats.js';
import axios from 'axios';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/select-tickets" element={<SelectTickets />} />
          <Route path="/select-seats" element={<SelectSeats />} />
          <Route path="/payment-info" element={<PaymentInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
