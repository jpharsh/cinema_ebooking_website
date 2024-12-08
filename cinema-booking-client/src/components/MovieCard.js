import React, { useState, useContext } from 'react';
import '../App.css';
import './MovieCard.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';  // Import the AuthContext

const MovieCard = ({ movie, isNowPlaying }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const { loggedIn } = useContext(AuthContext);  // Get loggedIn status from AuthContext

    const viewMovieInfo = () => {
        navigate('/movie-information', { state: { movie, isNowPlaying } });
    };

    const handleBookMovie = () => {
        if (!loggedIn) {
            // If the user is not logged in, redirect to login page
            navigate('/login');
        } else {
            // If the user is logged in, navigate to showtimes page
            navigate('/showtimes', { state: { movie } });
        }
    };

    return (
        <div
            className="movie-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img src={movie.poster_url} alt={`${movie.title} poster`} />
            <p className="movie-card-title">{movie.title} | {movie.mpaa_rating}</p>
            {isHovered && (
                <div className="movie-info">
                    <button style={{ width: '100%' }} className="btn white" onClick={viewMovieInfo}>
                        View Movie Info
                    </button>
                    {isNowPlaying && (
                        <button style={{ width: '100%' }} className="btn red" onClick={handleBookMovie}>
                            Book Movie
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MovieCard;
