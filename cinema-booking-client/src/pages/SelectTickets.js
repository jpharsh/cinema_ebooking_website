import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/MovieCard.css';
import './SelectTickets.css';
import '../App.css';
import { useLocation } from 'react-router-dom';

const SelectTickets = () => {
   const [adultCount, setAdultCount] = useState(0);
   const [childCount, setChildCount] = useState(0);
   const [seniorCount, setSeniorCount] = useState(0);
   const navigate = useNavigate();
   const location = useLocation();
   const movie = location.state?.movie;
   const showid = location.state?.showid;
   console.log("showid in Select Tickets", showid);
 
   if (!movie) {
     return <p>No movie information available</p>;
   }

   const getTotalPrice = () => {
       return (adultCount * 11.99) + (childCount * 9.99) + (seniorCount * 10.99);
   };


   const handleIncreaseButton = (setCount) => {
       setCount(prev => prev + 1);
   };


   const handleDecreaseButton = (count, setCount) => {
       if (count > 0) setCount(prev => prev - 1);
   };


   const handleCancel = () => {
       // Navigate back to the showtimes page
       navigate('/showtimes', { state: { movie } });
   };


   // Sprint 3 Work
   const getTotalTickets = () => adultCount + childCount + seniorCount;


   const handleConfirmTickets = () => {
       const ticketData = { adultCount, childCount, seniorCount };
       navigate('/select-seats', { state: { ...ticketData, movie, totalPrice: getTotalPrice(), showid } });
   };


   return (
       <div className="App">
           <div className="movie-section" style={{ width: '40%', alignContent: 'center', padding: '30px' }}>
               <h2 style={{ textAlign: 'left' }}>Select Tickets</h2>
               <div className="select-tickets-container">
                   <img src={movie.poster_url || "https://via.placeholder.com/150"} className="movie-poster" style={{width: '100%' }}alt={`${movie.title} poster`} />
                   <div className="ticket-selection-section">
                       <p style={{margin: '10px 100px 20px 0px'}}>Standard (per ticket)</p>
                       <div className="ticket-type">
                           <p>Adult</p>
                           <p>$11.99</p>
                           <div>
                               <button onClick={() => handleDecreaseButton(adultCount, setAdultCount)}>-</button>
                               <span style={{ margin: '0 20px' }}>{adultCount}</span>
                               <button onClick={() => handleIncreaseButton(setAdultCount)}>+</button>
                           </div>
                       </div>


                       <div className="ticket-type">
                           <p>Child</p>
                           <p>$9.99</p>
                           <div>
                               <button onClick={() => handleDecreaseButton(childCount, setChildCount)}>-</button>
                               <span style={{ margin: '0 20px' }}>{childCount}</span>
                               <button onClick={() => handleIncreaseButton(setChildCount)}>+</button>
                           </div>
                       </div>


                       <div className="ticket-type">
                           <p>Senior</p>
                           <p>$10.99</p>
                           <div>
                               <button onClick={() => handleDecreaseButton(seniorCount, setSeniorCount)}>-</button>
                               <span style={{ margin: '0 20px' }}>{seniorCount}</span>
                               <button onClick={() => handleIncreaseButton(setSeniorCount)}>+</button>
                           </div>
                       </div>


                       <h3 className="btn-container" style={{ padding: '30px 10px' }}>Total: ${getTotalPrice().toFixed(2)}</h3>
                   </div>
               </div>


               <div className="btn-container">
                 <button className="btn white" onClick={handleCancel}>Cancel</button>
               <button
               className="btn red"
               onClick={handleConfirmTickets}
               disabled={getTotalTickets() === 0 }>Confirm Tickets</button>
               </div>
           </div>
       </div>
   );
};


export default SelectTickets;