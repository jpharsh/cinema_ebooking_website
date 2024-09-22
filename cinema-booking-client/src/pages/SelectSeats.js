import React, { useState } from 'react';
import './SelectSeats.css';
import screen from '../images/screen.png';
import AvailableSeat from '../images/AvailableSeat.png';
import SelectedSeat from '../images/SelectedSeat.png';
import UnavailableSeat from '../images/UnavailableSeat.png';

const SelectSeats = () => {
    // Sample seat layout (0 = available, 1 = selected, 2 = unavailable)
    const initialSeats = [
        [0, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 2, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 2, 0, 2, 2],
        [2, 2, 0, 0, 0, 1, 1, 0, 0],
        [],[],
        [0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    const [seats, setSeats] = useState(initialSeats);

    const handleSeatClick = (row, col) => {
        const newSeats = seats.map((rowSeats, rowIndex) =>
            rowSeats.map((seat, colIndex) => {
                if (rowIndex === row && colIndex === col) {
                    if (seat === 0) return 1; // Change available seat to selected
                    if (seat === 1) return 0; // Change selected seat to available
                }
                return seat;
            })
        );
        setSeats(newSeats);
    };

    return (
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
             <button className="btn white">Cancel</button>
             <button className="btn red">Confirm Seats</button>
        </div>
        </div>
    );
};

export default SelectSeats;
