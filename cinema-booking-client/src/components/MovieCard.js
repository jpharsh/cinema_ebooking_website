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
                    
                        <Link 
                            to={{
                                pathname: '/movie-information',
                                state: { movie }
                            }}
                        >
                            <button style={{width: '100%'}}className="btn white">View Movie Info</button>
                        </Link>
                    
                    {/* <button 
                        className="btn red" 
                        onClick={() => onWatchTrailer(movie.trailer_url)}
                        
                    >Watch Trailer</button> */}
                    {isNowPlaying && (
                        <Link 
                            to={{
                                pathname: '/showtimes',
                                state: { movie }
                            }}
                        >
                            <button style={{width: '100%'}}className="btn red">Book Movie</button>
                        </Link>
                    )}
                </div>
            )}
            
        </div>

    );
};

export default MovieCard;
