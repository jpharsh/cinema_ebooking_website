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
    const confirmShowtime = () => {
        navigate('/select-tickets', { state: { movie } });
    };

    return (
        <div>
            <div className="app-container">
                <h2>Showtimes:</h2>
                <h2>{movie.title}</h2>
                <div>
                    {showtimes.map((showtime, index) => (
                        <DaySchedule
                            key={index}
                            date={new Date(showtime.showtime).toLocaleDateString()}
                            times={[new Date(showtime.showtime).toLocaleTimeString()]}
                        />
                    ))}
                    <button className="cancel-button" style={{ marginRight: '20px' }} onClick={handleBackClick}>Cancel</button>
                    <button className="btn red" onClick={confirmShowtime}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default Showtimes;
