import React, { useState } from 'react';
import './MovieCard.css';

const MovieCard = ({ movie, isNowPlaying, onWatchTrailer}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div>
            <div
                className="movie-card"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img src={movie.poster_url} alt={`${movie.title} poster`} />
                {isHovered && (
                    <div className="movie-info">
                        <button 
                            className="btn white" 
                            onClick={() => onWatchTrailer(movie.trailer_url)}
                        >Watch Trailer</button>
                        {isNowPlaying && (
                            <button className="btn red">Book Movie</button>
                        )}
                    </div>
                )}
            </div>
            <p className="movie-title">{movie.title} | {movie.mpaa_rating}</p>
        </div>
    );
};

export default MovieCard;
