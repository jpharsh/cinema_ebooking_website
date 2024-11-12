import React, { useState } from 'react';
import MovieCard from '../components/MovieCard';
import '../components/MovieCard.css';
import './SelectTickets.css';
import '../App.css';
import exampleMoviePoster from '../images/exampleMoviePoster.jpeg';
import { useLocation } from 'react-router-dom';

// import LoggedInNavbar from '../components/LoggedInNavbar';

const MovieInformation = () => {
    const location = useLocation();
    const movie = location.state?.movie; // Access the passed movie data

    if (!movie) {
        return <p>Movie information not found.</p>; // Handle the case where no data is passed
    }

  return (
    <div className="App">
    <div className="movie-section" style={{ width: '40%', alignContent: 'center', padding: '30px'}}>
        <h2 style={{ textAlign: 'left' }}>Movie Information</h2>
        <div className="select-tickets-container"> 
            {/* <div className="movie-card"/> */}
            
            <img src={exampleMoviePoster} className="movie-card" alt={`movie poster`} />
            <div className="ticket-selection-section">
                <div style={{textAlign: 'left', display: 'grid', gridGap: '15px'}}> 
                    <div style={{fontWeight: 'bold', fontSize: '30px'}}>movie.movieTitle</div>
                    <div>Rating</div>
                    <div>Category</div>
                    <div>Cast</div>
                    <div>Director</div>
                    <div>Producer</div>
                    <div>Synopsis</div>
                    {/* <div>Reviews</div> */}
                    {/* <div>Show dates and times</div> */}
                </div>
            </div>
            
        </div>
        <div className="btn-container">
            <button className="btn white">Back to Results</button>
            <button className="btn red">Book Movie</button>
        </div>
    </div>
    </div>
  );
};


export default MovieInformation;
