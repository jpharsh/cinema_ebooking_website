import React, { useState } from "react";
import "./ManageMovies.css";
import "../App.css";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";

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
        const response = await axios.get("http://127.0.0.1:5000/api/fetch-all-movies");
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []); // Only run once on mount  

  // Function to open the modal for editing or adding
  const openModal = (movie = null) => {
    if (!showModal && scheduleModal) {
      alert("Please finish scheduling movie or cancel.");
      return;
    }
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
        // reviews: "",
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
      "director",
      "producer",
      "movie_cast",
      "synopsis",
      "poster_url",
      "trailer_url",
    ];

    requiredFields.forEach((field) => {
      if (!currentMovie[field]) {
        newErrors[field] = `${field} is required`;
      }
    });

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
        window.location.reload();
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

  // Additional states
  const [scheduleModal, setScheduleModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [scheduleDatetime, setScheduleDatetime] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  // Open schedule modal
  const openScheduleModal = (movie = null) => {
    if (showModal) {
      alert("Please finish adding movie or cancel.");
      return;
    }
    setScheduleModal(true);
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
    setSelectedRoom(null);
    setScheduleDatetime("");
    setScheduleTime("");
  };

  // Close schedule modal
  const closeScheduleModal = () => {
    setScheduleModal(false);
    setErrors({});
  };

  const handleMovieSelection = (movieId) => {
    const selected = movies.find((movie) => movie.id === parseInt(movieId, 10));
    setSelectedMovie(selected); // Now selectedMovie will have the correct details
};

  const validateSchedule = () => {
    const newErrors = {};
    if (!selectedMovie || !selectedMovie.id) {
      newErrors.movie = "Please select a movie";
    }
    if (!selectedRoom) {
      newErrors.room = "Please select a room";
    }
    if (!scheduleDatetime) {
      newErrors.showDates = "Please select a date";
    }
    if (!scheduleTime) {
      newErrors.showTimes = "Please select a time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle scheduling
  const handleSchedule = async () => {
    console.log("Movie data:", selectedMovie); // Ensure this logs movie data
    if (!validateSchedule()) {
      console.log("Validate Schedule Movie failed");
      return; // Don't proceed if there are validation errors
    }
    if (!selectedMovie || !selectedMovie.id) {
        alert("Please select a movie before scheduling.");
        return;
    }
    const showtime = `${scheduleDatetime} ${scheduleTime}:00`;
    try {
        const response = await axios.post(
            "http://127.0.0.1:5000/api/schedule-movie",
            {
                movie_id: selectedMovie.id,
                room: selectedRoom,
                time: showtime,
            }
        );
        if (response.data.success) {
            alert("Movie scheduled successfully");
            closeScheduleModal();
            
            window.location.reload();
        } else {
            alert(
                response.data.error ||
                "Scheduling conflict: This room already has a movie at the selected time."
            );
        }
    } catch (error) {
      if (error.response?.data?.error) {
        alert(error.response.data.error); // Show specific error from backend
      } else {
          console.error("Error scheduling movie:", error);
          alert("An error occurred while scheduling the movie. Please check the console for details.");
      }
    }
};

  return (
    <div>
      <div className="admin-panel">
        {/* <aside className="sidebar">
          <ul>
            <li>Manage Movies</li>
            <li>Promo Codes</li>
            <li>Manage Users</li>
          </ul>
        </aside> */}
        <nav className="sidebar">
          <ul>
            <li><Link to="/admin-home">Home Page</Link></li>
            <li className="active"><Link to="/manage-movies">Manage Movies</Link></li>
            <li>Manage Users</li>
            <li><Link to="/promo">Manage Promos</Link></li>
          </ul>
        </nav>
        <main className="main-content">
          <h2>MOVIES</h2>
          <button onClick={() => openModal()} className="add-movie-button">
            Add Movie
          </button>
          <button className="sched-movie-button" onClick={openScheduleModal}>
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
              <div className="movie-card" style={{marginBottom: '70px'}} key={movie.id}>
                <img src={movie.poster_url || "https://via.placeholder.com/150"} className="movie-poster" alt={`${movie.title} poster`} />
                <p>{movie.title}</p>
                <p>Rating: {movie.mpaa_rating}</p> {/* Display rating separately */}
              </div>
            ))}
          </div>
        </main>

        {scheduleModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Schedule Movie</h3>
              <label>Choose Movie</label>
              <select
                onChange={(e) => handleMovieSelection(e.target.value)} // Call handleMovieSelection on movie change
              >
                <option value="">Select a movie</option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
              {errors.movie && <p className="error-message">{errors.movie}</p>}

              <label>Choose Room</label>
              <select onChange={(e) => setSelectedRoom(Number(e.target.value))}>
                <option value="">Select a room</option>
                {[1, 2, 3].map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
              {errors.room && <p className="error-message">{errors.room}</p>}

              <label>Schedule Date</label>
              <input
                type="date"
                value={scheduleDatetime}
                onChange={(e) => setScheduleDatetime(e.target.value)}
              />
              {errors.showDates && <p className="error-message">{errors.showDates}</p>}

              <label>Schedule Time</label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
              {errors.showTimes && <p className="error-message">{errors.showTimes}</p>}

              <button onClick={handleSchedule}>Schedule</button>
              <button onClick={closeScheduleModal}>Cancel</button>
            </div>
          </div>
        )}

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

              <label>Director</label>
              <input 
                type="text"
                placeholder="Director"
                value={currentMovie?.director || ""}
                onChange={(e) =>
                  setCurrentMovie({ ...currentMovie, director: e.target.value })
                }
              />
              {errors.director && <p className="error-message">{errors.director}</p>}

              <label>Producer</label>
              <input
                type="text"
                placeholder="Producer"
                value={currentMovie?.producer || ""}
                onChange={(e) =>
                  setCurrentMovie({ ...currentMovie, producer: e.target.value })
                }
              />
              {errors.producer && <p className="error-message">{errors.producer}</p>}

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

              {/* <label>Reviews</label>
              <input
                type="text"
                placeholder="Reviews"
                value={currentMovie?.reviews || ""}
                onChange={(e) =>
                  setCurrentMovie({ ...currentMovie, reviews: e.target.value })
                }
              />
              {errors.reviews && <p className="error-message">{errors.reviews}</p>} */}

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
              {errors.poster_url && <p className="error-message">{errors.poster_url}</p>}

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
                  setCurrentMovie({
                    ...currentMovie,
                    mpaa_rating: e.target.value,
                  })
                }
              />
              {errors.mpaa_rating && <p className="error-message">{errors.mpaa_rating}</p>}
              
              {/* <div className="show-dates">
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
              </div>*/}

              {/* <div className="show-times">
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
              </div>  */}

              <button onClick={handleSave} className="manage-button">
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