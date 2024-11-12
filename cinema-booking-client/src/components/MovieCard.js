import React, { useState } from 'react';
import '../App.css';
import './MovieCard.css';
import { Link } from 'react-router-dom';

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
                    {isNowPlaying && (
                        <Link 
                            to={{
                                pathname: '/movie-information',
                                state: { movie }
                            }}
                        >
                            <button style={{width: '100%'}}className="btn red">View Movie Info</button>
                        </Link>
                        // <button className="btn red">View Movie Info</button>
                    )}
                </div>
            )}
            
        </div>

    );
};

export default MovieCard;
