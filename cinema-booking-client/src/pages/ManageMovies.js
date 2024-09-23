// src/App.js
import React, { useState } from "react";
import "./ManageMovies.css";
import searchIcon from "../images/search-icon.png"; // Import the search icon image

function ManageMovies() {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Avengers",
      rating: "PG-13",
      category: "",
      cast: "",
      director: "",
      producer: "",
      synopsis: "",
      reviews: "",
      trailerPicture:
        "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
      trailerVideo: "",
      showDates: [],
      showTimes: [],
    },
    {
      id: 2,
      title: "Avengers: Endgame",
      rating: "PG-13",
      category: "",
      cast: "",
      director: "",
      producer: "",
      synopsis: "",
      reviews: "",
      trailerPicture:
        "https://cdn.marvel.com/content/1x/avengersendgame_lob_crd_05.jpg",
      trailerVideo: "",
      showDates: [],
      showTimes: [],
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState(""); // Temporary state for date selection
  const [tempTime, setTempTime] = useState(""); // Temporary state for time selection
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  // Function to open the modal for editing or adding
  const openModal = (movie = null) => {
    setCurrentMovie(
      movie || {
        id: null,
        title: "",
        rating: "",
        category: "",
        cast: "",
        director: "",
        producer: "",
        synopsis: "",
        reviews: "",
        trailerPicture: "",
        trailerVideo: "",
        showDates: [],
        showTimes: [],
      }
    );
    setIsEditing(Boolean(movie));
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setCurrentMovie(null);
    setTempDate(""); // Clear temporary date when modal is closed
    setTempTime(""); // Clear temporary time when modal is closed
  };

  // Function to handle saving changes (edit or add)
  const handleSave = () => {
    if (isEditing) {
      // Update existing movie
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === currentMovie.id ? currentMovie : movie
        )
      );
    } else {
      // Add new movie
      setMovies([...movies, { ...currentMovie, id: Date.now() }]);
    }
    closeModal();
  };

  // Function to handle deleting a movie with confirmation
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      setMovies(movies.filter((movie) => movie.id !== id));
    }
  };

  // Function to handle adding new show dates
  const handleAddShowDate = () => {
    if (tempDate) {
      setCurrentMovie((prevMovie) => ({
        ...prevMovie,
        showDates: [...prevMovie.showDates, tempDate],
      }));
      setTempDate(""); // Clear the temporary date after adding
    }
  };

  // Function to handle adding new show times
  const handleAddShowTime = () => {
    if (tempTime) {
      setCurrentMovie((prevMovie) => ({
        ...prevMovie,
        showTimes: [...prevMovie.showTimes, tempTime],
      }));
      setTempTime(""); // Clear the temporary time after adding
    }
  };

  // Filter movies based on search term (case-insensitive)
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-panel">
      <header className="header">
        <h1>Admin</h1>
        <div className="logo">Cinema Movies</div>
        <div className="user-icon">👤</div>
      </header>
      <aside className="sidebar">
        <ul>
          <li>Home Page</li>
          <li>Manage Movies</li>
          <li>Promo Codes</li>
          <li>Manage Users</li>
        </ul>
      </aside>
      <main className="main-content">
        <h2>MOVIES</h2>
        <button onClick={() => openModal()} className="add-movie-button">
          Add Movie
        </button>
        <input
          type="text"
          className="search-bar"
          style={{
            width: "80%",
            padding: "12px",
            margin: "10px auto",
            border: "1px solid #444",
          }}
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <img
                src={movie.trailerPicture || "https://via.placeholder.com/150"}
                alt={movie.title}
                className="movie-poster"
              />
              <p>{movie.title}</p>
              <p>Rating: {movie.rating}</p> {/* Display rating separately */}
              <div className="button-group">
                <button
                  onClick={() => openModal(movie)}
                  className="button edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(movie.id)}
                  className="button delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal Component */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? "Edit Movie" : "Add Movie"}</h3>
            <label>Title</label>
            <input
              type="text"
              placeholder="Title"
              value={currentMovie?.title || ""}
              onChange={(e) =>
                setCurrentMovie({ ...currentMovie, title: e.target.value })
              }
            />

            <label>Category</label>
            <input
              type="text"
              placeholder="Category"
              value={currentMovie?.category || ""}
              onChange={(e) =>
                setCurrentMovie({ ...currentMovie, category: e.target.value })
              }
            />

            <label>Cast</label>
            <input
              type="text"
              placeholder="Cast"
              value={currentMovie?.cast || ""}
              onChange={(e) =>
                setCurrentMovie({ ...currentMovie, cast: e.target.value })
              }
            />

            <label>Synopsis</label>
            <textarea
              placeholder="Synopsis"
              value={currentMovie?.synopsis || ""}
              onChange={(e) =>
                setCurrentMovie({ ...currentMovie, synopsis: e.target.value })
              }
            />

            <label>Reviews</label>
            <input
              type="text"
              placeholder="Reviews"
              value={currentMovie?.reviews || ""}
              onChange={(e) =>
                setCurrentMovie({ ...currentMovie, reviews: e.target.value })
              }
            />

            <label>Trailer Picture URL</label>
            <input
              type="text"
              placeholder="Trailer Picture URL"
              value={currentMovie?.trailerPicture || ""}
              onChange={(e) =>
                setCurrentMovie({
                  ...currentMovie,
                  trailerPicture: e.target.value,
                })
              }
            />

            <label>Trailer Video URL</label>
            <input
              type="text"
              placeholder="Trailer Video URL"
              value={currentMovie?.trailerVideo || ""}
              onChange={(e) =>
                setCurrentMovie({
                  ...currentMovie,
                  trailerVideo: e.target.value,
                })
              }
            />

            <label>MPAA Rating</label>
            <input
              type="text"
              placeholder="MPAA Rating"
              value={currentMovie?.rating || ""}
              onChange={(e) =>
                setCurrentMovie({ ...currentMovie, rating: e.target.value })
              }
            />

            <div className="show-dates">
              <label>Show Dates:</label>
              <input
                type="date"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
              />
              <button onClick={handleAddShowDate} className="button">
                Add Date
              </button>
              <ul>
                {currentMovie?.showDates.map((date, index) => (
                  <li key={index}>{date}</li>
                ))}
              </ul>
            </div>

            <div className="show-times">
              <label>Show Times:</label>
              <input
                type="time"
                value={tempTime}
                onChange={(e) => setTempTime(e.target.value)}
              />
              <button onClick={handleAddShowTime} className="button">
                Add Time
              </button>
              <ul>
                {currentMovie?.showTimes.map((time, index) => (
                  <li key={index}>{time}</li>
                ))}
              </ul>
            </div>

            <button onClick={handleSave} className="button">
              Save
            </button>
            <button onClick={closeModal} className="button">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageMovies;
