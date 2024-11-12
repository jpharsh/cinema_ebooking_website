// src/App.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
// import AdminNavbar from '../components/AdminNavbar';

function AdminHomePage() {
  const navigate = useNavigate();

  const handleManageMoviesClick = () => {
      navigate('/manage-movies'); // Navigate to the homepage
  };

  const handleManagePromosClick = () => {
    navigate('/promo'); // Navigate to manage promos
};
  
  return (
    <>
      {/* Cinema Movies Header */}
      {/* <header className="header">
        <div className="header-content">
          <span className="admin-logo">Admin</span>
          <span className="logo">Cinema Movies</span>
          
        </div>
      </header>
      <AdminNavbar />*/}

      {/* Main Admin Page Content */}
      <div className="admin-container">
        <h1 className="greeting">Hello Admin!</h1>
        <p className="sub-greeting">Pick one of the choices below</p>

        <div className="admin-button-group">
          <button className="admin-button" onClick={handleManageMoviesClick}>Manage Movies</button>
          <button className="admin-button">Manage Users</button>
          <button className="admin-button" onClick={handleManagePromosClick}>Manage Promos</button>
        </div>
      </div>
    </>
  );
}

function adminhome() {
  return <AdminHomePage />;
}

export default adminhome;