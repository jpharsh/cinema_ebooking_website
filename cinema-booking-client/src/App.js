import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthContext, AuthProvider } from './AuthContext';
import GeneralNavbar from './components/GeneralNavbar.js';
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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MovieInformation from './pages/MovieInformation.js';
import AllMovies from './pages/AllMovies.js';
import './App.css';

function App() {
    const { loggedIn, isAdmin, logout, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    const userRole = isAdmin ? 'admin' : loggedIn ? 'user' : 'guest';

    return (
        <>
            <GeneralNavbar userRole={userRole} onLogout={logout} />
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
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/movie-information" element={<MovieInformation />} />
                <Route path="/all-movies" element={<AllMovies />} />
            </Routes>
        </>
    );
}

export default function WrappedApp() {
    return (
        <AuthProvider>
            <Router>
                <App />
            </Router>
        </AuthProvider>
    );
}
