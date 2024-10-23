import React, { useState } from 'react';
import './Promo.css';
// import AdminNavbar from '../components/AdminNavbar';

function PromoTable({ promos, searchQuery, onDelete }) {
  const filteredPromos = promos.filter(
    promo => promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
             promo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <table className="promo-table">
      <thead>
        <tr>
          <th>Promo Code</th>
          <th>Description</th>
          <th>Expiration Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredPromos.map((promo, index) => (
          <tr key={index}>
            <td>{promo.code}</td>
            <td>{promo.description}</td>
            <td>{promo.expirationDate}</td>
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
  const [promos, setPromos] = useState([
    { code: 'freemov1e', description: 'Two free tickets to a movie', expirationDate: '2024-12-31' },
    { code: 'kid4321', description: 'Kids Watch for Free for one week', expirationDate: '2024-10-07' },
    { code: 'coupon20', description: '20% off any size popcorn', expirationDate: '2024-10-31' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPromo, setNewPromo] = useState({ code: '', description: '', expirationDate: '' });

  const handleAddPromo = () => {
    if (newPromo.code && newPromo.description && newPromo.expirationDate) {
      setPromos([...promos, newPromo]);
      setNewPromo({ code: '', description: '', expirationDate: '' });
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
            <li>Home Page</li>
            <li className="active">Promo Codes</li>
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
            <button className="add-promo-button" onClick={handleAddPromo}>Add Promo</button>
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
            <input 
              type="text" 
              placeholder="Description" 
              value={newPromo.description}
              onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
            />
            <input 
              type="date" 
              value={newPromo.expirationDate}
              onChange={(e) => setNewPromo({ ...newPromo, expirationDate: e.target.value })}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function promo() {
  return <AdminPage />;
}

export default promo;