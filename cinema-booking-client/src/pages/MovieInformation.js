import React, { useState } from 'react';
import '../components/MovieCard.css';
import './SelectTickets.css';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const MovieInformation = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const movie = location.state?.movie;

    if (!movie) {
        return <p>No movie information available</p>;
    }
    
    const handleBackClick = () => {
        navigate('/');
    };

    const handleBookClick = () => {
        navigate('/showtimes');
    };

  return (
    <div className="App">
    <div className="movie-section" style={{ width: '40%', alignContent: 'center', padding: '30px'}}>
        <h2 style={{ textAlign: 'left' }}>Movie Information</h2>
        <div className="select-tickets-container"> 
            {/* <div className="movie-card"/> */}
            
            <img src={movie.poster_url || "https://via.placeholder.com/150"} className="movie-poster" alt={`${movie.title} poster`} />
            <div className="ticket-selection-section">
                <div style={{textAlign: 'left', display: 'grid', gridGap: '15px'}}> 
                    <div style={{fontWeight: 'bold', fontSize: '30px'}}>{ movie.title }</div>
                    <div>Rating: { movie.mpaa_rating }</div>
                    <div>Category: { movie.category }</div>
                    <div>Cast: { movie.movie_cast }</div>
                    <div>Director: { movie.director }</div>
                    <div>Producer: { movie.producer }</div>
                    <div>Synopsis: { movie.synopsis }</div>
                    {/* <div>Reviews</div> */}
                    {/* <div>Show dates and times</div> */}
                </div>
            </div>
            
        </div>
        <div className="btn-container">
            <button className="btn white" onClick={handleBackClick}>Back to Results</button>
            <button className="btn red" onClick={handleBookClick}>Book Movie</button>
        </div>
    </div>
    </div>
  );
};


export default MovieInformation;
