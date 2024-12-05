import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; //ava added
import './SelectSeats.css';
import screen from '../images/screen.png';
import AvailableSeat from '../images/AvailableSeat.png';
import SelectedSeat from '../images/SelectedSeat.png';
import UnavailableSeat from '../images/UnavailableSeat.png';
// import LoggedInNavbar from '../components/LoggedInNavbar';
import { useEffect } from 'react';

const SelectSeats = () => {
   const navigate = useNavigate();
   const location = useLocation();
   
//    const { adultCount, childCount, seniorCount } = location.state || {};
//    const totalTickets = (adultCount || 0) + (childCount || 0) + (seniorCount || 0);
   const seatLayout = [9, 9, 9, 9, 11, 11, 11]; // Number of seats in each row
   const showid = location.state?.showid;
   const date = location.state?.date;
   const time = location.state?.time;

    // Function to map database seats to the layout
function initializeSeats(seatStatuses) {
    const initialSeats = [];
    let seatIndex = 0;

    seatLayout.forEach((numSeatsInRow) => {
        const row = [];
        for (let i = 0; i < numSeatsInRow; i++) {
            if (seatIndex < seatStatuses.length) {
                row.push(seatStatuses[seatIndex].seat_status);
                seatIndex++;
            } else {
                row.push(2); // Default to unavailable if no data
            }
        }
        initialSeats.push(row);
    });

    return initialSeats;
}

// Function to fetch seat statuses from the API
async function fetchSeatStatuses(showId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/get-seats?show_id=${showId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch seat statuses: ${response.statusText}`);
        }
        const seatStatuses = await response.json(); // Assumes the response is in the expected format
        return seatStatuses;
    } catch (error) {
        console.error("Error fetching seat statuses:", error);
        return []; // Return an empty array on error
    }
}

// Main function to retrieve and display seats
async function displaySeats(showId) {
    const seatStatuses = await fetchSeatStatuses(showId); // Fetch the seat statuses
    const initialSeats = initializeSeats(seatStatuses);  // Map them to the theater layout

    return initialSeats;
}

    // set initial seats
   const [seats, setSeats] = useState([]); 
   useEffect(() => {
       const fetchAndSetSeats = async () => {
           const initialSeats = await displaySeats(showid); // Call the main function with the show ID
           setSeats(initialSeats);
       };
       fetchAndSetSeats();
   }, []);
   const [selectedSeats, setSelectedSeats] = useState(0); //ava added
   const [userSeats, setUserSeats] = useState([]); // Track user-selected seats
   const [formattedSeats, setFormattedSeats] = useState([]); 

   const handleSeatClick = (row, col) => {
       const seatIndex = seatLayout.slice(0, row).reduce((sum, seatsInRow) => sum + seatsInRow, 0) + col;
       // get the seat id of the selected seat
       const seat_id = seatIndex + 1;
       
       const newSeats = seats.map((rowSeats, rowIndex) =>
           rowSeats.map((seat, colIndex) => {
               if (rowIndex === row && colIndex === col) {
                //    if (seat === 0 && selectedSeats < totalTickets) {
                    if (seat === 0) {
                       setSelectedSeats(prev => prev + 1);
                        //setUserSeats(prev => [...prev, { row, col }]); // Add seat
                           setUserSeats(prev => [...prev, { seat_id }]); // Add seat
                           setFormattedSeats(prev => [...prev, { row, col }]); 
                       return 1;
                   }
                   if (seat === 1) {
                       setSelectedSeats(prev => prev - 1);
                        //setUserSeats(prev => prev.filter(seat => !(seat.row === row && seat.col === col))); // Remove seat
                           setUserSeats(prev => prev.filter(seat => seat.seat_id !== (seat_id))); // Remove seat
                           setFormattedSeats(prev => prev.filter(seat => !(seat.row === row && seat.col === col)));
                       return 0;
                   }
               }
               return seat;
           })
       );
       setSeats(newSeats);
   };

    const handleConfirmSeats = async () => {
        navigate('/select-tickets', { state: { movie, formattedSeats, date, time, showid } });
        
        // DO THIS AFTER BOOKING IS COMPLETE: 
            // try {
            //     // Make an API call to update the seat statuses to 2 for the specific show_id
            //     const response = await fetch('http://127.0.0.1:5000/api/update-seat-status', {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify({
            //             show_id: showid, // Assuming movie has the show_id
            //             selectedSeats: userSeats, // An array of selected seat IDs
            //         }),
            //     });

            //     if (response.ok) {
            //         // Navigate to select tickets page if the update was successful
            //         navigate('/select-tickets', { state: { movie, formattedSeats, date, time, showid } });
            //     } else {
            //         // Handle failure response
            //         alert('Error updating seat statuses.');
            //     }
            // } catch (error) {
            //     console.error('Error updating seat statuses:', error);
            //     alert('Error updating seat statuses.');
            // }
    };

   const handleCancel = () => {
     navigate('/showtimes', { state: { movie } });
   };

   const movie = location.state?.movie;
//    const totalPrice = location.state?.totalPrice;
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
            <button className="btn red" onClick={handleConfirmSeats} disabled={userSeats.length === 0}>Confirm Seats</button>
       </div>
       </div>
       </div>
   );
};


export default SelectSeats;