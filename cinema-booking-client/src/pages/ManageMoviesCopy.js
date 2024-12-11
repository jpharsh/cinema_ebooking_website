import React, { useState } from "react";
import "./ManageMovies.css";
import "../App.css";
import axios from "axios";
import { useEffect } from "react";

function ManageMovies() {
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState(""); // Temporary state for date selection
  const [tempTime, setTempTime] = useState(""); // Temporary state for time selection
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [errors, setErrors] = useState({}); // State for error messages

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
        mpaa_rating: "",
        category: "",
        movie_cast: "",
        director: "",
        producer: "",
        synopsis: "",
        reviews: "",
        poster_url: "",
        trailer_url: "",
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
    setErrors({});
  };

  // Validate the movie fields
  const validateMovie = () => {
    const newErrors = {};
    const requiredFields = [
      "title",
      "mpaa_rating",
      "category",
      "movie_cast",
      "synopsis",
      "reviews",
      "poster_url",
      "trailer_url",
    ];

    requiredFields.forEach((field) => {
      if (!currentMovie[field]) {
        newErrors[field] = `${field} is required`;
      }
    });

    if (currentMovie.showDates.length === 0) {
      newErrors.showDates = "At least one show date is required";
    }

    if (currentMovie.showTimes.length === 0) {
      newErrors.showTimes = "At least one show time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle saving changes (edit or add)
  const handleSave = () => {
    if (!validateMovie()) {
      console.log("Validation failed");
      return; // Don't proceed if there are validation errors
    }
    
    if (isEditing) {
      // Update existing movie
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === currentMovie.id ? currentMovie : movie
        )
      );
    } else {
      // Check for duplicate movie titles
      if (movies.some((movie) => movie.title === currentMovie.title)) {
        alert("A movie with this title already exists.");
        return;
      }

      axios
      .post("http://127.0.0.1:5000/api/movies", currentMovie)
      .then((response) => {
        setMovies([...movies, { ...currentMovie, id: response.data.id }]); // Use response data to update the local list
        closeModal();
        console.log("Movie added successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error adding movie:", error);
      });
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
                <img src={movie.poster_url || "https://via.placeholder.com/150"} className="movie-poster" alt={`${movie.title} poster`} />
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
              {errors.title && <p className="error-message">{errors.title}</p>}

              <label>Category</label>
              <input
                type="text"
                placeholder="Category"
                value={currentMovie?.category || ""}
                onChange={(e) =>
                  setCurrentMovie({ ...currentMovie, category: e.target.value })
                }
              />
              {errors.category && <p className="error-message">{errors.category}</p>}

              <label>Cast</label>
              <input
                type="text"
                placeholder="Cast"
                value={currentMovie?.movie_cast || ""}
                onChange={(e) =>
                  setCurrentMovie({ ...currentMovie, movie_cast: e.target.value })
                }
              />
              {errors.movie_cast && <p className="error-message">{errors.movie_cast}</p>}

              <label>Synopsis</label>
              <textarea
                placeholder="Synopsis"
                value={currentMovie?.synopsis || ""}
                onChange={(e) =>
                  setCurrentMovie({ ...currentMovie, synopsis: e.target.value })
                }
              />
              {errors.synopsis && <p className="error-message">{errors.synopsis}</p>}

              <label>Reviews</label>
              <input
                type="text"
                placeholder="Reviews"
                value={currentMovie?.reviews || ""}
                onChange={(e) =>
                  setCurrentMovie({ ...currentMovie, reviews: e.target.value })
                }
              />
              {errors.reviews && <p className="error-message">{errors.reviews}</p>}

              <label>Trailer Picture URL</label>
              <input
                type="text"
                placeholder="Trailer Picture URL"
                value={currentMovie?.poster_url || ""}
                onChange={(e) =>
                  setCurrentMovie({
                    ...currentMovie,
                    poster_url: e.target.value,
                  })
                }
              />
              {errors.trailerPicture && <p className="error-message">{errors.trailerPicture}</p>}

              <label>Trailer Video URL</label>
              <input
                type="text"
                placeholder="Trailer Video URL"
                value={currentMovie?.trailer_url || ""}
                onChange={(e) =>
                  setCurrentMovie({
                    ...currentMovie,
                    trailer_url: e.target.value,
                  })
                }
              />
              {errors.trailer_url && <p className="error-message">{errors.trailer_url}</p>}

              <label>MPAA Rating</label>
              <input
                type="text"
                placeholder="MPAA Rating"
                value={currentMovie?.mpaa_rating || ""}
                onChange={(e) =>
                  setCurrentMovie({ ...currentMovie, mpaa_rating: e.target.value })
                }
              />
              {errors.rating && <p className="error-message">{errors.rating}</p>}

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
                {errors.showDates && <p className="error-message">{errors.showDates}</p>}
              </div>

              <div className="show-times">
                <label>Show Times:</label>
                <input
                  type="time"
                  value={tempTime}
                  onChange={(e) => setTempTime(e.target.value)}
                />
                <button onClick={handleAddShowTime} className="manage-button">
                  Add Time
                </button>
                <ul>
                  {currentMovie?.showTimes.map((time, index) => (
                    <li key={index}>{time}</li>
                  ))}
                </ul>
                {errors.showTimes && <p className="error-message">{errors.showTimes}</p>}
              </div>
              <button onClick={handleSave}>
                {isEditing ? "Save Changes" : "Add Movie"}
              </button>
              <button onClick={closeModal} className="manage-button">
                Cancel
              </button>
            </div>
          </div>
        )}
       </div>
    </div>
  );
}

export default ManageMovies;
