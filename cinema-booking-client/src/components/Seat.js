import React, { useState } from 'react';
import './Seat.css';
import AvailableSeat from '../images/AvailableSeat.png';
import UnavailableSeat from '../images/UnavailableSeat.png';

const Seat = ({ movie }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button 
            className="seat"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <img src={isHovered ? UnavailableSeat : AvailableSeat} alt={isHovered ? "Unavailable Seat" : "Available Seat"} className="single-seat-pic" />
        </button>
    );
};

export default Seat;