import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import axios from 'axios';
import '../App.css';
import './HomePage.css'
import Advertisement from '../images/Advertisement1.png';
import Navbar from '../components/Navbar';

const HomePage = () => {
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [comingSoonMovies, setComingSoonMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedTrailer, setSelectedTrailer] = useState(null);

    // Fetch Now Playing movies from Flask API
    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/now-playing')
            .then(response => {
                setNowPlayingMovies(response.data);
            })
            .catch(error => {
                console.error("Error fetching now playing movies:", error);
            });

        // Fetch Coming Soon movies from Flask API
        axios.get('http://127.0.0.1:5000/api/coming-soon')
            .then(response => {
                setComingSoonMovies(response.data);
            })
            .catch(error => {
                console.error("Error fetching coming soon movies:", error);
            });
    }, []);

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        // Combine movies from both categories to search against
        const allMovies = [...nowPlayingMovies, ...comingSoonMovies];
        
        // Filter movies based on title match
        const filteredSuggestions = searchTerm ? allMovies.filter(movie => 
            movie.title && movie.title.toLowerCase().includes(searchTerm)
        ) : []; // Clear suggestions if searchTerm is empty

        setSuggestions(filteredSuggestions); // Update suggestions state
    };

    const handleSuggestionClick = (movieTitle) => {
        setSearchTerm(movieTitle); // Set the search bar to the selected movie
        setSuggestions([]); // Hide suggestions after selection
    };

    const handleBlur = () => {
        setSuggestions([]); // Clear suggestions when the input loses focus
    };

    const watchTrailer = (trailerUrl) => {
        setSelectedTrailer(trailerUrl); // Set the trailer URL to display the trailer
    };

    const closeTrailer = () => {
        setSelectedTrailer(null); // Close the trailer pop-up
    };

    return (
        <div>
            <Navbar />
            <div className="App" style={{ padding: '20px', position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Search for a movie..."
                    value={searchTerm}
                    onChange={handleSearch}
                    onBlur={handleBlur}
                    className="search-input"
                    style={{ width: '100%', padding: '10px' }}
                />
                {/* Suggestion Dropdown */}
                {suggestions.length > 0 && (
                    <div className="suggestion-dropdown" style={{ 
                        position: 'absolute', 
                        top: '50px', 
                        left: '0', 
                        width: '100%', 
                        maxHeight: '200px', 
                        overflowY: 'auto', 
                        border: '1px solid #ddd', 
                        backgroundColor: '#fff', 
                        zIndex: '1000',
                        borderRadius: '4px' 
                    }}>
                        {suggestions.map((movie, index) => (
                            <div 
                                key={index} 
                                className="suggestion-item" 
                                style={{ padding: '10px', cursor: 'pointer' }}
                                onClick={() => handleSuggestionClick(movie.title)}
                            >
                                {movie.title}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="movie-section" style={{ padding: '0px', height: '400px' }}>
                <img src={Advertisement} alt="Advertisement" className="advertisement-pic" />
            </div>

            {/* Movie Lists */}
            <div className="movie-section">
                <h2 style={{ textAlign: 'left' }}>Now Playing</h2>
                <MovieList 
                    movies={nowPlayingMovies.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))} 
                    isNowPlaying={true}
                    onWatchTrailer={watchTrailer}
                />
            </div>

            <div className="movie-section">
                <h2 style={{ textAlign: 'left' }}>Coming Soon</h2>
                <MovieList 
                    movies={comingSoonMovies.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))}
                    isNowPlaying={false}
                    onWatchTrailer={watchTrailer} 
                />
            </div>

            <button className="btn red">All Movies</button>

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

export default HomePage;