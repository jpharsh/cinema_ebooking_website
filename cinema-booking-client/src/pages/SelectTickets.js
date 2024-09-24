import React, { useState } from 'react';
import MovieCard from '../components/MovieCard';
import '../components/MovieCard.css';
import './SelectTickets.css';
import '../App.css';
import exampleMoviePoster from '../images/exampleMoviePoster.jpeg';
import LoggedInNavbar from '../components/LoggedInNavbar';

const SelectTickets = ( {movie} ) => {

  const getTotalPrice = () => {
      let total = (parseInt(document.getElementById('numberA').innerText) * 11.99)+ (parseInt(document.getElementById('numberC').innerText) * 9.99)+ (parseInt(document.getElementById('numberS').innerText) * 10.99);
      document.getElementById('total').innerText = 'Total: $' + total.toFixed(2);
  };

const handleDecreaseButton = (number) => {
  let val = parseInt(document.getElementById(number).innerText);
  if (val > 0) {
      document.getElementById(number).innerText = val - 1;
      if (number === 'numberA') {
          setAdultAges((prev) => {
              const newAges = [...prev];
              newAges.pop();
              return newAges;
          });
      } else if (number === 'numberC') {
          setChildAges((prev) => {
              const newAges = [...prev];
              newAges.pop();
              return newAges;
          });
      } else if (number === 'numberS') {
          setSeniorAges((prev) => {
              const newAges = [...prev];
              newAges.pop();
              return newAges;
          });
      }
  }
  getTotalPrice();
};

const handleIncreaseButton = (number) => {
  document.getElementById(number).innerText = parseInt(document.getElementById(number).innerText) + 1;
  if (number === 'numberA') {
      setAdultAges((prev) => [...prev, '']);
  } else if (number === 'numberC') {
      setChildAges((prev) => [...prev, '']);
  } else if (number === 'numberS') {
      setSeniorAges((prev) => [...prev, '']);
  } 
  getTotalPrice();
};

  const [adultAges, setAdultAges] = useState([]);
  const [childAges, setChildAges] = useState([]);
  const [seniorAges, setSeniorAges] = useState([]);

  const handleAgeChange = (type, index, value) => {
      if (type === 'adult') {
          const newAges = [...adultAges];
          newAges[index] = value;
          setAdultAges(newAges);
      } else if (type === 'child') {
          const newAges = [...childAges];
          newAges[index] = value;
          setChildAges(newAges);
      } else if (type === 'senior') {
          const newAges = [...seniorAges];
          newAges[index] = value;
          setSeniorAges(newAges);
      }
  };

  return (
    <div>
        <LoggedInNavbar />
    
    <div className="App">
    <div className="movie-section" style={{ width: '40%', alignContent: 'center', padding: '30px'}}>
        <h2 style={{ textAlign: 'left' }}>Select Tickets</h2>
        <div className="select-tickets-container"> 
            {/* <div className="movie-card"/> */}
            
            <img src={exampleMoviePoster} className="movie-card" alt={`movie poster`} />
            <div className="ticket-selection-section">
                <p style={{margin: '20px 60px 20px 10px'}}>Standard (per ticket)</p>
                <div className="ticket-type">
                    <p>Adult</p>
                    <p>$11.99</p>
                    <div>
                        <button onClick={() => handleDecreaseButton('numberA')}>-</button>
                        <span id="numberA" style={{ margin: '0 20px'}}>0</span>
                        <button onClick={() => handleIncreaseButton('numberA')}>+</button>
                    </div>
                </div>
                <div>
                    {adultAges.map((age, index) => (
                    <div key={index}>
                        <label className="btn-container">
                            Age: 
                            <input
                                className="input-box"
                                style={{ width: '80px', height: '10px', marginBottom: '10px'}}
                                type="number"
                                value={age}
                                onChange={(e) => handleAgeChange('adult', index, e.target.value)}
                                min="0"
                            />
                        </label>
                    </div>
                    ))}
                </div>
                <div className="ticket-type">
                    <p>Child</p>
                    <p>$9.99</p>
                    <div>
                        <button onClick={() => handleDecreaseButton('numberC')}>-</button>
                        <span id="numberC" style={{ margin: '0 20px'}}>0</span>
                        <button onClick={() => handleIncreaseButton('numberC')}>+</button>
                    </div>
                </div>
                <div>
                    {childAges.map((age, index) => (
                    <div key={index}>
                        <label className="btn-container">
                            Age: 
                            <input
                                className="input-box"
                                style={{ width: '80px', height: '10px', marginBottom: '10px'}}
                                type="number"
                                value={age}
                                onChange={(e) => handleAgeChange('child', index, e.target.value)}
                                min="0"
                            />
                        </label>
                    </div>
                    ))}
                </div>
                <div className="ticket-type">
                    <p>Senior</p>
                    <p>$10.99</p>
                    <div>
                        <button onClick={() => handleDecreaseButton('numberS')}>-</button>
                        <span id="numberS" style={{ margin: '0 20px'}}>0</span>
                        <button onClick={() => handleIncreaseButton('numberS')}>+</button>
                    </div>
                </div>
                <div>
                    {seniorAges.map((age, index) => (
                    <div key={index}>
                        <label className="btn-container">
                            Age: 
                            <input 
                                className="input-box"
                                style={{ width: '80px', height: '10px', marginBottom: '10px'}}
                                type="number"
                                value={age}
                                onChange={(e) => handleAgeChange('senior', index, e.target.value)}
                                min="0"
                            />
                        </label>
                    </div>
                    ))}
                </div>
                <h3 className="btn-container" id="total" style={{ padding: '30px 10px'}}>Total: $0.00</h3>
            </div>
        </div>
        <div className="btn-container">
            <button className="btn white">Cancel</button>
            <button className="btn red">Confirm Tickets</button>
        </div>
    </div>
    </div>
    </div>
  );
};

// For future reference?? :
// const SelectTickets = ({ movie }) => {
//     const [adultTickets, setAdultTickets] = useState(0);
//     const [childTickets, setChildTickets] = useState(0);
//     const [seniorTickets, setSeniorTickets] = useState(0);

//     return (
//         <div className="select-tickets-container">
//             <h2 style={{ textAlign: 'left' }}>Select Tickets</h2>
//             <div className="movie-card">
//                 {/* <img src={movie.posterUrl} alt={movie.name} className="movie-poster" /> */}
//             </div>

//             <div className="ticket-selection-section">
                
//                 <div className="ticket-type">
//                     <label>Adult Tickets:</label>
//                     <input 
//                         type="number" 
//                         min="0" 
//                         value={adultTickets} 
//                         onChange={(e) => setAdultTickets(Number(e.target.value))} 
//                     />
//                 </div>

//                 <div className="ticket-type">
//                     <label>Child Tickets:</label>
//                     <input 
//                         type="number" 
//                         min="0" 
//                         value={childTickets} 
//                         onChange={(e) => setChildTickets(Number(e.target.value))} 
//                     />
//                 </div>

//                 <div className="ticket-type">
//                     <label>Senior Tickets:</label>
//                     <input 
//                         type="number" 
//                         min="0" 
//                         value={seniorTickets} 
//                         onChange={(e) => setSeniorTickets(Number(e.target.value))} 
//                     />
//                 </div>

//                 <button className="purchase-btn">Proceed to Checkout</button>
//             </div>
//         </div>
//     );
// };


export default SelectTickets;
