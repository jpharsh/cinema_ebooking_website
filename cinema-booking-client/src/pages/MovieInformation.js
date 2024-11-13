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
    const [selectedTrailer, setSelectedTrailer] = useState(null);

    if (!movie) {
        return <p>No movie information available</p>;
    }

    const watchTrailer = (trailerUrl) => {
        setSelectedTrailer(trailerUrl); // Set the trailer URL to display the trailer
    };

    const closeTrailer = () => {
        setSelectedTrailer(null); // Close the trailer pop-up
    };
    
    const handleBackClick = () => {
        navigate('/');
    };

    const handleBookClick = () => {
        navigate('/showtimes');
    };

  return (
    <div className="App">
    <div className="movie-section" style={{ width: '40%', alignContent: 'center', padding: '30px', paddingTop: '60px'}}>
        <div className="select-tickets-container"> 
            {/* <div className="movie-card"/> */}
           
            <img src={movie.poster_url || "https://via.placeholder.com/150"} className="movie-poster" style={{width: '100%' }}alt={`${movie.title} poster`} />
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
                    <button 
                        className="trailer-link" 
                        onClick={() => watchTrailer(movie.trailer_url)}>  
                        Watch Trailer
                    </button>
                </div>
            </div>
            
        </div>
        <div className="btn-container">
            <button className="btn white" onClick={handleBackClick}>Back to Results</button>
            <button className="btn red" onClick={handleBookClick}>Book Movie</button>
        </div>
    </div>
    {/* Trailer Pop-up */}
    {selectedTrailer && (
        <div className="trailer-popup">
            <div className="trailer-popup-content">
                <button className="close-button" onClick={closeTrailer}>X</button>
                <iframe 
                    width="100%" 
                    height="400px" 
                    src={selectedTrailer} 
                    title="Trailer" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    )}
    </div>
  );
};


export default MovieInformation;
