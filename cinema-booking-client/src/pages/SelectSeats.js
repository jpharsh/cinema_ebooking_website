import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; //ava added
import './SelectSeats.css';
import screen from '../images/screen.png';
import AvailableSeat from '../images/AvailableSeat.png';
import SelectedSeat from '../images/SelectedSeat.png';
import UnavailableSeat from '../images/UnavailableSeat.png';
// import LoggedInNavbar from '../components/LoggedInNavbar';


const SelectSeats = () => {
   const navigate = useNavigate();
   const location = useLocation();
   
   const { adultCount, childCount, seniorCount } = location.state || {};
   const totalTickets = (adultCount || 0) + (childCount || 0) + (seniorCount || 0);
   
   
    
   // Sample seat layout (0 = available, 1 = selected, 2 = unavailable)
   const initialSeats = [
       [0, 0, 2, 0, 0, 0, 0, 0, 0],
       [0, 2, 2, 2, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 2, 2, 0, 2, 2],
       [2, 2, 0, 0, 0, 0, 0, 0, 0],
       
       [0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
   ];


   const [seats, setSeats] = useState(initialSeats);
   const [selectedSeats, setSelectedSeats] = useState(0); //ava added
   const [userSeats, setUserSeats] = useState([]); // Track user-selected seats

   const handleSeatClick = (row, col) => {
       const newSeats = seats.map((rowSeats, rowIndex) =>
           rowSeats.map((seat, colIndex) => {
               if (rowIndex === row && colIndex === col) {
                   if (seat === 0 && selectedSeats < totalTickets) {
                       setSelectedSeats(prev => prev + 1);
                       setUserSeats(prev => [...prev, { row, col }]); // Add seat
                       return 1;
                   }
                   if (seat === 1) {
                       setSelectedSeats(prev => prev - 1);
                       setUserSeats(prev => prev.filter(seat => !(seat.row === row && seat.col === col))); // Remove seat
                       return 0;
                   }
               }
               return seat;
           })
       );
       setSeats(newSeats);
   };


   const handleConfirmSeats = () => {
       if (selectedSeats === totalTickets) {
           navigate('/payment-info', { state: { totalPrice, movie, userSeats } });
       } else {
           alert(`Please select exactly ${totalTickets} seat(s).`);
       }
   };


   const handleCancel = () => {
     navigate('/select-tickets', { state: { movie } });
   };

   const movie = location.state?.movie;
   const totalPrice = location.state?.totalPrice;
   if (!movie) {
    return <p>No movie information available</p>;
   }

   return (
       <div>
           {/*<LoggedInNavbar />*/}
       <div className="movie-section" style={{ width: '40%', alignContent: 'center', padding: '20px' }}>
       <h2 style={{ textAlign: 'left' }}>Select Seats</h2>
       <div className="select-seats-container">
           <img src={screen} alt="screen" className="seats-pic" />
           <div className="seat-grid">
               {seats.map((row, rowIndex) => (
                   <div key={rowIndex} className="seat-row">
                       {row.map((seat, colIndex) => (
                           <button
                               key={colIndex}
                               className={`seat ${
                                   seat === 0 ? 'available' : seat === 1 ? 'selected' : 'unavailable'
                               }`}
                              
                               onClick={() => seat !== 2 && handleSeatClick(rowIndex, colIndex)}
                           >
                               <img src={
                                   seat === 0 ? AvailableSeat : seat === 1 ? SelectedSeat : UnavailableSeat
                               } alt="Seat" className="single-seat-pic" />
                           </button>
                       ))}
                   </div>
               ))}
           </div>
           <div className="legend">
               <div><img src={AvailableSeat} alt="Available Seat" className="single-seat-pic" /> Available</div>
               <div><img src={SelectedSeat} alt="Selected Seat" className="single-seat-pic" /> Selected</div>
               <div><img src={UnavailableSeat} alt="Unavailable Seat" className="single-seat-pic" /> Unavailable</div>
           </div>
       </div>
       <div className="btn-container">
            <button className="btn white" onClick={handleCancel}>Cancel</button>
            <button className="btn red" onClick={handleConfirmSeats}>Confirm Seats</button>
       </div>
       </div>
       </div>
   );
};


export default SelectSeats;