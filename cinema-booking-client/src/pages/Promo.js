import React, { useState } from 'react';
import './Promo.css';
import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';


// import AdminNavbar from '../components/AdminNavbar';

function PromoTable({ promos, searchQuery, onDelete }) {
  const filteredPromos = promos.filter(
    promo => promo.promo_code.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <table className="promo-table">
      <thead>
        <tr>
          <th>Promo Code</th>
          <th></th>
          <th>Discount Amount</th>
          <th>Expiration Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredPromos.map((promo, index) => (
          <tr key={index}>
            <td>{promo.promo_code}</td>
            <td>{promo.description}</td>
            <td>{promo.promo_amount}%</td>
            <td>{promo.exp_date}</td>
            <td>
                <button className="delete-button" onClick={() => onDelete(index)}>
                  Delete
                </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AdminPage() {
  const [promos, setPromos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPromo, setNewPromo] = useState({ code: '', description: '', expirationDate: '' });

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/promos')
      .then(response => {
        setPromos(response.data);  // Update state with data from the database
      })
      .catch(error => {
        console.error('There was an error fetching the promos:', error);
      });
  }, []);

  const handleAddPromo = async () => {
    if (newPromo.code && newPromo.discount && newPromo.expirationDate) {
      try {
        // Send a POST request to the Flask backend to save the promo
        const response = await axios.post('http://127.0.0.1:5000/api/add-promo', {
          code: newPromo.code,
          discount: newPromo.discount,
          expirationDate: newPromo.expirationDate
        });
  
        if (response.status === 201) {
          // Add the promo to the local state only if it was successfully saved in the database
          const updatedPromosResponse = await axios.get('http://127.0.0.1:5000/api/promos');
          setPromos(updatedPromosResponse.data);
          setNewPromo({ code: '', discount: '', expirationDate: '' });

        } else {
          alert('Failed to add promo');
        }
      } catch (error) {
        console.error('Error adding promo:', error);
        alert('An error occurred while adding the promo: ', error);
      }
    } else {
      alert('Please fill out all fields');
    }
  };

  const handleDeletePromo = (index) => {
    const updatedPromos = promos.filter((promo, promoIndex) => promoIndex !== index);
    setPromos(updatedPromos);
  };

  return (
    <>
      {/* Header */}
      {/* <header className="header">
        <div className="header-content">
          <span className="admin-logo">Admin</span>
          <span className="logo">Cinema Movies</span>
        </div>
      </header> */}
    <div>
        {/*<AdminNavbar />*/}
    </div>
      <div className="promo-container">
        {/* Sidebar */}
        <nav className="sidebar">
          <ul>
            <li><Link to="/admin-home">Home Page</Link></li>
            <li><Link to="/manage-movies">Manage Movies</Link></li>
            <li>Manage Users</li>
            <li className="active"><Link to="/promo">Manage Promos</Link></li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="main-content">
          {/* Search Bar */}
          <div className="promo-search-container">
            <input 
              type="text" 
              className="promo-search-bar" 
              placeholder="Search promo codes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* <button className="add-promo-button" onClick={handleAddPromo}>Add Promo</button> */}
          </div>

          {/* Promo Table */}
          <PromoTable promos={promos} searchQuery={searchQuery} onDelete={handleDeletePromo} />

          {/* Add Promo Section */}
          <div className="add-promo-form">
            <input 
              type="text" 
              placeholder="Promo Code" 
              value={newPromo.code}
              onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
            />
            {/* <input 
              type="text" 
              placeholder="Description" 
              value={newPromo.description}
              onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
            /> */}
            <input 
              type="text" 
              placeholder="Discount Amount"
              value={newPromo.discount}
              onChange={(e) => setNewPromo({ ...newPromo, discount: e.target.value })}
            />
            <input 
              type="date" 
              value={newPromo.expirationDate}
              onChange={(e) => setNewPromo({ ...newPromo, expirationDate: e.target.value })}
            />
          </div>
          <button className="add-promo-button" onClick={handleAddPromo}>Add Promo</button>
        </div>
      </div>
    </>
  );
}

function promo() {
  return <AdminPage />;
}

export default promo;
