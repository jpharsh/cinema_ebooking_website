import React from 'react';
import MovieCard from './MovieCard';
import './MovieList.css';

const MovieList = ({ movies , isNowPlaying}) => {
  return (
    <div className="movie-list">
      {movies.map((movie, index) => (
        <MovieCard 
          key={index} 
          movie={movie} 
          isNowPlaying={isNowPlaying}
        />
      ))}
    </div>
  );
};

export default MovieList;