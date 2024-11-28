import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Showtimes.css';

function ShowtimeCard({ time }) {
    return <button className="time-button">{time}</button>;
}

function DaySchedule({ date, times }) {
    return (
        <div className="day-container">
            <div className="day-header-container">
                <div>
                    <h2 className="day-header">{date}</h2>
                </div>
            </div>
            <div>
                {times.map((time, index) => (
                    <ShowtimeCard key={index} time={time} />
                ))}
            </div>
        </div>
    );
}

const Showtimes = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const movie = location.state?.movie;
    const [showtimes, setShowtimes] = useState([]);

    useEffect(() => {
        if (movie) {
            // Fetch showtimes for the specific movie
            axios.get(`http://127.0.0.1:5000/api/showtimes/${movie.id}`)
                .then(response => {
                    setShowtimes(response.data);
                    console.log("Showtimes fetched:", response.data);
                })
                .catch(error => {
                    console.error("Error fetching showtimes:", error);
                });
        }
    }, [movie]);

    if (!movie) {
        return <p>No movie information available</p>;
    }

    const handleBackClick = () => {
        navigate('/', { state: { movie } });
    };
    
    const handleTimeClick = (date, time) => {
        console.log(`Time selected: ${time}`);
        const showtime = showtimes.find(showtime => new Date(showtime.showtime).toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: true }) === time);
        const showid = showtime.id;
        navigate('/select-tickets', { state: { movie, showid, date, time } });
    };

    const DaySchedule = ({ date, times }) => (
        <div className="day-container">
            <div className="day-header-container">
                <h2 className="day-header">{date}</h2>
            </div>
            <div>
                {times.map((time, index) => (
                <button
                    key={index}
                    className="time-button"
                    onClick={() => handleTimeClick(date, time)}
                >
                    {time}
                </button>
                ))}
            </div>
        </div>
    );
    
    // Group showtimes by date
    const groupedShowtimes = showtimes.reduce((unique, showtime) => {
        const date = new Date(showtime.showtime).toLocaleDateString('en-US', { timeZone: 'UTC' });
        
        if (!unique[date]) {
            unique[date] = []; // Initialize a new array for each unique date
        }
        
        unique[date].push(
            new Date(showtime.showtime).toLocaleTimeString('en-US', {
                timeZone: 'UTC',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })
        );
        
        return unique;
    }, {});

    // Render each date group with its list of times
    return (
        <div>
        <div className="app-container">
            <h2>Showtimes for:</h2>
            <h2>{movie.title}</h2>
            <div>
            {Object.entries(groupedShowtimes).map(([date, times]) => (
                <DaySchedule key={date} date={date} times={times} />
            ))}
            <button className="cancel-button" style={{ marginRight: '20px' }} onClick={handleBackClick}>
                Cancel
            </button>
            
            </div>
        </div>
        </div>
    );
};

export default Showtimes;