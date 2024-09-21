import React, { useState } from 'react';
import MovieCard from '../components/MovieCard';
import '../components/MovieCard.css';
import './SelectTickets.css';

const SelectTickets = ( {movies} ) => {
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [adultTickets, setAdultTickets] = useState(0);

  const handleTicketSelection = (ticket) => {
    setSelectedTickets((prevSelectedTickets) => [...prevSelectedTickets, ticket]);
  };

  return (
    <div className="movie-section" style={{ width: '50%', alignContent: 'center'}}>
        <h2 style={{ textAlign: 'left' }}>Select Tickets</h2>
        <div className="select-tickets-container"> 
            <div className="movie-card"/>
            <div className="ticket-selection-section">
                <p>Standard (per ticket)</p>
                <div className="ticket-type">
                    <p>Adult</p>
                    <p>$11.99</p>
                    {/* <button>-</button>
                    <input 
                        type="number" 
                        min="0" 
                        value={adultTickets} 
                        onChange={(e) => setAdultTickets(Number(e.target.value))} 
                   />
                    <button>+</button> */}
                </div>
               
                <p>Child</p>
                <p>Senior</p>
            </div>
        </div>
        
    </div>
  );
};

// const SelectTickets = ({ movie }) => {
//     const [adultTickets, setAdultTickets] = useState(0);
//     const [childTickets, setChildTickets] = useState(0);
//     const [seniorTickets, setSeniorTickets] = useState(0);

//     return (
//         <div className="select-tickets-container">
//             <h2 style={{ textAlign: 'left' }}>Select Tickets</h2>
//             <div className="movie-card">
//                 {/* <img src={movie.posterUrl} alt={movie.name} className="movie-poster" /> */}
//             </div>

//             <div className="ticket-selection-section">
                
//                 <div className="ticket-type">
//                     <label>Adult Tickets:</label>
//                     <input 
//                         type="number" 
//                         min="0" 
//                         value={adultTickets} 
//                         onChange={(e) => setAdultTickets(Number(e.target.value))} 
//                     />
//                 </div>

//                 <div className="ticket-type">
//                     <label>Child Tickets:</label>
//                     <input 
//                         type="number" 
//                         min="0" 
//                         value={childTickets} 
//                         onChange={(e) => setChildTickets(Number(e.target.value))} 
//                     />
//                 </div>

//                 <div className="ticket-type">
//                     <label>Senior Tickets:</label>
//                     <input 
//                         type="number" 
//                         min="0" 
//                         value={seniorTickets} 
//                         onChange={(e) => setSeniorTickets(Number(e.target.value))} 
//                     />
//                 </div>

//                 <button className="purchase-btn">Proceed to Checkout</button>
//             </div>
//         </div>
//     );
// };


export default SelectTickets;
