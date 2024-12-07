import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import axios from 'axios';
import '../App.css';
import './HomePage.css';
import Advertisement from '../images/Advertisement1.png';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [comingSoonMovies, setComingSoonMovies] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/now-playing')
            .then(response => setNowPlayingMovies(response.data))
            .catch(error => console.error("Error fetching now playing movies:", error));

        axios.get('http://127.0.0.1:5000/api/coming-soon')
            .then(response => setComingSoonMovies(response.data))
            .catch(error => console.error("Error fetching coming soon movies:", error));
    }, []);

    return (
        <div>
            {/* Advertisement Section */}
            <div className="movie-section" style={{ padding: '0px', height: '400px' }}>
                <img src={Advertisement} alt="Advertisement" className="advertisement-pic" />
            </div>

            {/* Now Playing Movies Section */}
            <div className="movie-section">
                <h2 style={{ textAlign: 'left' }}>Now Playing</h2>
                <MovieList 
                    movies={nowPlayingMovies}
                    isNowPlaying={true}
                />
            </div>

            {/* Coming Soon Movies Section */}
            <div className="movie-section">
                <h2 style={{ textAlign: 'left' }}>Coming Soon</h2>
                <MovieList 
                    movies={comingSoonMovies}
                    isNowPlaying={false}
                />
            </div>

            {/* All Movies Button */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link to="/all-movies">
                    <button className="btn red">All Movies</button>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
