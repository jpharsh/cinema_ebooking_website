import React, { useState } from 'react';
import '../App.css';
import './MovieCard.css';

const MovieCard = ({ movie, isNowPlaying, onWatchTrailer}) => {
    const [isHovered, setIsHovered] = useState(false);

    return ( 
        <div
            style={{ maxHeight: '350px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            
            <img src={movie.poster_url} className="movie-card" alt={`${movie.title} poster`} />
            <p className="movie-card-title">{movie.title} | {movie.mpaa_rating}</p>
            {isHovered && (
                <div className="movie-info">
                    <button 
                        className="btn white" 
                        onClick={() => onWatchTrailer(movie.trailer_url)}
                    >Watch Trailer</button>
                    {/* {isNowPlaying && (
                        <button className="btn red">Book Movie</button>
                    )} */}
                    <button className="btn red">Book Movie</button>
                </div>
            )}
            
        </div>

    );
};

export default MovieCard;
