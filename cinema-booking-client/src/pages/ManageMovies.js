import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API requests
import "./ManageMovies.css";
import "../App.css";
import searchIcon from "../images/search-icon.png"; // Import the search icon image

function ManageMovies() {
  const [movies, setMovies] = useState([]); // Set initial movies state to an empty array
  const [showModal, setShowModal] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState(""); // Temporary state for date selection
  const [tempTime, setTempTime] = useState(""); // Temporary state for time selection
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  // Fetch movies from the backend API (all movies)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/fetch-all-movies"); // Use the new endpoint
        setMovies(response.data); // Set the movies from the API response to the state
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []); // Empty dependency array means it runs once when the component mounts

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
    <div> 
      <div className="admin-panel">
        <aside className="sidebar">
          <ul>
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
          <button className="sched-movie-button">
            Schedule Movie
          </button>
          <div>
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
          </div>

          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <div className="movie-card" key={movie.id}>
                <img
                  src={movie.poster_url || "https://via.placeholder.com/150"}
                  alt={movie.title}
                  className="movie-poster"
                />
                <p>{movie.title}</p>
                <p>Rating: {movie.mpaa_rating}</p> {/* Display rating separately */}
                <div className="manage-button-group">
                  <button
                    onClick={() => openModal(movie)}
                    className="manage-button edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(movie.id)}
                    className="manage-button delete"
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

              {/* Ratings */}
              <label>MPAA Rating</label>
              <input
                type="text"
                value={currentMovie?.mpaa_rating || ""}
                onChange={(e) =>
                  setCurrentMovie({ ...currentMovie, mpaa_rating: e.target.value })
                }
              />

              {/* Date and Time Management */}
              <div className="show-dates">
                <label>Show Dates:</label>
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                />
                <button onClick={handleAddShowDate}>Add Date</button>
                <ul>
                  {currentMovie?.showDates?.map((date, index) => (
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
                <button onClick={handleAddShowTime}>Add Time</button>
                <ul>
                  {currentMovie?.showTimes?.map((time, index) => (
                    <li key={index}>{time}</li>
                  ))}
                </ul>
              </div>

              <button onClick={handleSave}>
                {isEditing ? "Save Changes" : "Add Movie"}
              </button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageMovies;
