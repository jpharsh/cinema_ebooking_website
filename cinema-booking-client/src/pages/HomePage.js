import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import axios from 'axios';
import '../App.css';
import './HomePage.css'
import Advertisement from '../images/Advertisement1.png';

const HomePage = () => {
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [comingSoonMovies, setComingSoonMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);

    const categories = ['Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi'];

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/now-playing')
            .then(response => setNowPlayingMovies(response.data))
            .catch(error => console.error("Error fetching now playing movies:", error));

        axios.get('http://127.0.0.1:5000/api/coming-soon')
            .then(response => setComingSoonMovies(response.data))
            .catch(error => console.error("Error fetching coming soon movies:", error));
    }, []);

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);
        setIsSearching(searchTerm.length > 0);
        localStorage.setItem('searchTerm', searchTerm);
    
        const allMovies = [...nowPlayingMovies, ...comingSoonMovies];
        const filteredSuggestions = searchTerm
            ? allMovies.filter(movie => movie.title && movie.title.toLowerCase().startsWith(searchTerm))
            : [];
            
        setSuggestions(filteredSuggestions.length ? filteredSuggestions : [{ title: 'No movies found' }]);
    };    

    const handleSuggestionClick = (movieTitle) => {
        setSearchTerm(movieTitle);
        setSuggestions([]);
    };

    const handleBlur = () => {
        setSuggestions([]);
        setIsSearching(false);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const addFilter = (category) => {
        if (!selectedFilters.includes(category)) {
            setSelectedFilters([...selectedFilters, category]);
        }
        setShowDropdown(false);
    };

    const removeFilter = (category) => {
        setSelectedFilters(selectedFilters.filter((filter) => filter !== category));
    };

    /// Filter movies based on selected categories and search term
    const filterMovies = (movies) => {
        return movies.filter(movie => {
            const matchesCategory = selectedFilters.length === 0 || selectedFilters.includes(movie.category);
            const matchesSearch = searchTerm === "" || movie.title.toLowerCase().startsWith(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    };

    return (
        <div>
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

                {/* Filter bubble */}
                <div style={{ marginTop: '10px', display: 'inline-block' }}>
                    <button onClick={toggleDropdown}>Filter</button>
                    
                    {showDropdown && (
                        <div style={{ border: '1px solid #ddd', padding: '10px', marginTop: '5px' }}>
                            {categories.map((category) => (
                                <div
                                    key={category}
                                    onClick={() => addFilter(category)}
                                    style={{ cursor: 'pointer', padding: '5px' }}
                                >
                                    {category}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '10px' }}>
                    {selectedFilters.map((filter) => (
                        <span
                            key={filter}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '5px 10px',
                                backgroundColor: '#eee',
                                borderRadius: '15px',
                                margin: '0 5px',
                                color: 'red'
                            }}
                        >
                            {filter}
                            <span
                                onClick={() => removeFilter(filter)}
                                style={{
                                    marginLeft: '8px',
                                    cursor: 'pointer',
                                    color: '#ff0000'
                                }}
                            >
                                x
                            </span>
                        </span>
                    ))}
                </div>
            </div>

            {!searchTerm && (
                <div className="movie-section" style={{ padding: '0px', height: '400px' }}>
                    <img src={Advertisement} alt="Advertisement" className="advertisement-pic" />
                </div>
            )}

            {/* Movie Lists */}
            <div className="movie-section">
                <h2 style={{ textAlign: 'left' }}>Now Playing</h2>
                <MovieList 
                    movies={filterMovies(nowPlayingMovies)}
                    isNowPlaying={true}
                />
            </div>

            <div className="movie-section">
                <h2 style={{ textAlign: 'left' }}>Coming Soon</h2>
                <MovieList 
                    movies={filterMovies(comingSoonMovies)}
                    isNowPlaying={false}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="btn red">All Movies</button>
            </div>
        </div>
    );
};

export default HomePage;
