import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieList from './components/MovieList';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage.js';
import SelectTickets from './pages/SelectTickets.js';
import axios from 'axios';
import './App.css';

// function App() {
//     // const [movies, setMovies] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const movies = Array.from({ length: 10 }).map((_, i) => ({
//         name: "Movie " + i,
//         description: "Description " + i,
//         show_time: "12:00",
//     }));
//     const handleSearch = (event) => {
//       setSearchTerm(event.target.value);
//     };

//     // // Fetch movie data from Flask API
//     // useEffect(() => {
//     //     axios.get('http://127.0.0.1:5000/api/movies')
//     //         .then(response => {
//     //             setMovies(response.data);
//     //         })
//     //         .catch(error => {
//     //             console.error("Error fetching movies:", error);
//     //         });
//     // }, []);

//     return (
//         <div className="App">
//             <Navbar />
//             <h1> </h1>
//             <div style={{ padding: '20px' }}>
//                 <input
//                     type="text"
//                     placeholder="Search for a movie..."
//                     value={searchTerm}
//                     onChange={handleSearch}
//                 />
//             </div>
//             <div className="movie-section">
//               <h2 style={{ textAlign: 'left' }}>Now Playing</h2> 
//               <MovieList movies={movies.filter(movie => movie.name.toLowerCase().includes(searchTerm.toLowerCase()))} />
//             </div>
            
//             <div className="movie-section">
//               <h2 style={{ textAlign: 'left' }}>Coming Soon</h2> 
//               <MovieList movies={movies} />
//             </div>
//             <button className="btn red">All Movies</button>
//         </div>
//     );
// }

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/select-tickets" element={<SelectTickets />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
