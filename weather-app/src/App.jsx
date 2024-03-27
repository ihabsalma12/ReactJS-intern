import "./App.css";
import { useState } from "react";

// OpenWeather API, used for fetch call
const api = {
  key: "d691d1c1c48b6c0469c5c09ef6f012a1",
  base: "https://api.openweathermap.org/data/2.5/",
};





function App() {
  /* 
  Hook is a built-in function, such as this state hook (useState()) to handle a component's data that changes over time
  State hook returns an array of two elements: [variable, updater_function].
  The updater function updates the variable aka the state, at which point, the state has changed and react will re-render the component. 
  */
  const [searchBar, setSearchBar] = useState("");  // We initialize the hook as an empty string "". To update 'searchBar', we must call setSearchBar
  const [weather, setWeather] = useState({});  // We initialize the hook as an empty dict/map {}. To update 'weather', we must call setWeather


  /*
    This function is a callback to onClick() for the search button.
    Once search button is pressed, make a fetch call to the Open Weather Map API.
  */
  const fetchWeather = () => {
    fetch(`${api.base}weather?q=${searchBar}&units=metric&APPID=${api.key}`) //The 'searchBar' hook variable is used to know what the user has typed into the search bar.
      .then((res) => res.json())
      .then((result) => {
        setWeather(result); //The 'weather' hook variable is updated using 'setWeather'. 
        console.log(result); //check console
      });
  };


  // Component JSX
  return (
    <div> {/* EXTRA: we may add CSS in App.css, but for now, let's leave it as default */}
      <header>
        {/* HEADER  */}
        <h1>Weather App</h1>

        {/* SEARCH BAR = Input + Button  */}
        <div >
          <p><input
            type="text"
            placeholder="Enter city/ town..."
            // We update 'searchBar' hook variable so the button callback fetches the right city weather data in 'fetchWeather' function.
            onChange={(e) => setSearchBar(e.target.value)} //browser event 'e'. User typing in search bar. 
          /></p>
          
          <button onClick={fetchWeather}>Search </button>
        </div>


        {/* Conditional rendering using ternary operator '?': When user first opens website, there is no search result because he didn't search yet!
        So, if weather is not undefined display results from API. */}
        {typeof weather.main !== "undefined" ? (
          <div  className= "card">
            
            <div className="weather-info text-center">
              {/* Location  */}
                <p><b>{weather.name}, {weather.sys.country}</b></p>
                {/* Temperature Celsius */}
                <p>Temperature: {weather.main.temp}°C</p>
                <p>Feels like: <b>{weather.main.feels_like}°C</b></p>
                <p>Weather: {weather.weather[0].main} ({weather.weather[0].description})</p>
                {/* <p>Humidity: 60%</p>
                <p>Wind Speed: 5 m/s</p>
                <p>Visibility: 10 km</p> */}

            

            
            {/* <p> {weather.main.humidity} </p> */}
            {/* <p>{weather.main.pressure}</p> */}
            {/* <p>Max: <b>{weather.main.temp_max}°C</b></p> */}
            {/* <p>Min: <b>{weather.main.temp_min}°C</b></p> */}

            {/* Condition (Sunny ) */}
            

            {/* Wind  */}
            {/* <p>{weather.wind.deg}</p> */}
            {/* <p>{weather.wind.speed}</p>  */}
          </div>
          </div>
            
        ) : (
          ""
        )}
      </header>
    </div>
  );
}

export default App;


