// src/App.js
import React from 'react';
import './Showtimes.css';
// import LoggedInNavbar from '../components/LoggedInNavbar';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function ShowtimeCard({ time }) {
  return <button className="time-button">{time}</button>;
}

function DaySchedule({ date, times }) {
  return (
    <div className="day-container">
      <div className="day-header-container">
        <div>
          <h2 className="day-header">{date}</h2>
        </div>
      </div>
      <div>
        {times.map(time => (
          <ShowtimeCard key={time} time={time} />
        ))}
      </div>
    </div>
  );
}

const Showtimes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const movie = location.state?.movie;

  if (!movie) {
    return <p>No movie information available</p>;
  }

  const handleBackClick = () => {
    navigate('/movie-information', { state: { movie } });
  };
  const confirmShowtime = () => {
    navigate('/select-tickets', { state: { movie } });
  };

  return (
    <div>
      {/* <header className="header">Cinema Movies</header> */}
      {/*<LoggedInNavbar/>*/}
        <div>
          <div className="app-container">
            <h2>Showtimes:</h2>
            <h2>{movie.title}</h2>
            <div>
            
              <DaySchedule date="Tue, Sept 17" times={['9:00 AM', '12:30 PM', '2:00 PM', '6:30 PM', '10:00 PM']} />
              <DaySchedule date="Wed, Sept 18" times={['9:00 AM', '12:30 PM', '2:00 PM', '6:30 PM', '10:00 PM']} />
              <DaySchedule date="Thurs, Sept 19" times={['9:00 AM', '12:30 PM', '2:00 PM', '6:30 PM', '10:00 PM']} />
              <DaySchedule date="Fri, Sept 20" times={['9:00 AM', '12:30 PM', '2:00 PM', '6:30 PM', '10:00 PM']} />
              <button className="cancel-button" style={{marginRight: '20px'}} onClick={handleBackClick}>Cancel</button>
              <button className="btn red" onClick={confirmShowtime}>Confirm</button>
             
            </div>
          </div>
        </div>
    </div>
  );
}

export default Showtimes;