import React, { useState } from 'react';
import '../App.css';
import './MovieCard.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie, isNowPlaying}) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const viewMovieInfo = () => {
        navigate('/movie-information', { state: { movie } });
    };
    const handleBookMovie = () => {
        navigate('/showtimes', { state: { movie } });
    };
    

    

    return ( 
        <div
            style={{ maxHeight: '350px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img src={movie.poster_url} className="movie-card" alt={`${movie.title} poster`} />
            <p className="movie-card-title">{movie.title} | {movie.mpaa_rating} </p>
            {isHovered && (
                <div className="movie-info">
                    <button style={{ width: '100%' }} className="btn white" onClick={viewMovieInfo}>View Movie Info</button>
                    {isNowPlaying && (
                        <button 
                            style={{ width: '100%' }}
                            className="btn red"
                            onClick={handleBookMovie}
                        >
                            Book Movie
                        </button>
                    )}
                </div>
            )}
        </div>
    );
    
};

export default MovieCard;
