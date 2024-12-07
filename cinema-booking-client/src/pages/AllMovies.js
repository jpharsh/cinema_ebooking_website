import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import './AllMovies.css';
import MovieCard from '../components/MovieCard';

const AllMovies = () => {
    const [allMovies, setAllMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showDatesDropdown, setShowDatesDropdown] = useState(false);
    const [showDates, setShowDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');

    const categories = ['Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi'];

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/fetch-all-movies')
            .then(response => setAllMovies(response.data))
            .catch(error => console.error("Error fetching movies:", error));

        axios.get('http://127.0.0.1:5000/api/show-dates')
            .then(response => setShowDates(response.data))
            .catch(error => console.error("Error fetching show dates:", error));
    }, []);

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);
        const filteredSuggestions = searchTerm
            ? allMovies.filter(movie => movie.title && movie.title.toLowerCase().startsWith(searchTerm))
            : [];
        setSuggestions(filteredSuggestions.length ? filteredSuggestions : [{ title: 'No movies found' }]);
    };

    const handleSuggestionClick = (movieTitle) => {
        setSearchTerm(movieTitle);
        setSuggestions([]);
    };

    const toggleCategoryDropdown = () => {
        setShowCategoryDropdown(!showCategoryDropdown);
    };

    const toggleDatesDropdown = () => {
        setShowDatesDropdown(!showDatesDropdown);
    };

    const addFilter = (category) => {
        if (!selectedFilters.includes(category)) {
            setSelectedFilters([...selectedFilters, category]);
        }
        setShowCategoryDropdown(false);
    };

    const removeFilter = (category) => {
        setSelectedFilters(selectedFilters.filter((filter) => filter !== category));
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setShowDatesDropdown(false);

        if (date) {
            axios.get(`http://127.0.0.1:5000/api/movies-by-date?date=${date}`)
                .then(response => setAllMovies(response.data))
                .catch(error => console.error("Error fetching movies by date:", error));
        } else {
            axios.get('http://127.0.0.1:5000/api/fetch-all-movies')
                .then(response => setAllMovies(response.data))
                .catch(error => console.error("Error fetching all movies:", error));
        }
    };

    const clearSelectedDate = () => {
        setSelectedDate('');
        axios.get('http://127.0.0.1:5000/api/fetch-all-movies')
            .then(response => setAllMovies(response.data))
            .catch(error => console.error("Error fetching all movies:", error));
    };

    const filterMovies = (movies) => {
        return movies.filter(movie => {
            const matchesCategory = selectedFilters.length === 0 || selectedFilters.includes(movie.category);
            const matchesSearch = searchTerm === '' || movie.title.toLowerCase().startsWith(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    };

    return (
        <div className="App" style={{ padding: '20px', position: 'relative' }}>
            <input
                type="text"
                placeholder="Search for a movie..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
                style={{ padding: '20px', width: '100%' }}
            />

            {suggestions.length > 0 && (
                <div className="suggestion-dropdown">
                    {suggestions.map((movie, index) => (
                        <div
                            key={index}
                            className="suggestion-item"
                            onClick={() => handleSuggestionClick(movie.title)}
                        >
                            {movie.title}
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <div>
                    <button onClick={toggleCategoryDropdown}>By Category</button>
                    {showCategoryDropdown && (
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
                <div>
                    <button onClick={toggleDatesDropdown}>By Date</button>
                    {showDatesDropdown && (
                        <div style={{
                            border: '1px solid #ddd',
                            padding: '10px',
                            marginTop: '5px',
                            maxHeight: '200px',
                            overflowY: 'scroll',
                        }}>
                            {showDates.map((date) => (
                                <div
                                    key={date}
                                    onClick={() => handleDateSelect(date)}
                                    style={{ cursor: 'pointer', padding: '5px' }}
                                >
                                    {date}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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
                            color: 'red',
                        }}
                    >
                        {filter}
                        <span
                            onClick={() => removeFilter(filter)}
                            style={{
                                marginLeft: '8px',
                                cursor: 'pointer',
                                color: '#ff0000',
                            }}
                        >
                            x
                        </span>
                    </span>
                ))}
                {selectedDate && (
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '5px 10px',
                            backgroundColor: '#eee',
                            borderRadius: '15px',
                            margin: '0 5px',
                            color: 'blue',
                        }}
                    >
                        {selectedDate}
                        <span
                            onClick={clearSelectedDate}
                            style={{
                                marginLeft: '8px',
                                cursor: 'pointer',
                                color: '#ff0000',
                            }}
                        >
                            x
                        </span>
                    </span>
                )}
            </div>

            <div className="movie-grid">
                {filterMovies(allMovies).map((movie) => (
                    <MovieCard 
                        key={movie.id} 
                        movie={movie} 
                        isNowPlaying={movie.isNowShowing ? true : false} 
                    />
                ))}
            </div>
        </div>
    );
};

export default AllMovies;
