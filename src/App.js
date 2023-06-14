import hotBg from "./assets/hot.jpg";
import coldBg from "./assets/cold.jpg";
import Descriptions from "./components/Descriptions";
import { useEffect, useState } from "react";
import { getFormattedWeatherData, getSimilarCities, getTimezone } from "./weatherService";
import Switch from "react-switch";

function App() {
  const [city, setCity] = useState("Paris");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg);
  const [similarCities, setSimilarCities] = useState([]);
  const [timezone, setTimezone] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const weatherData = await getFormattedWeatherData(city, units);
      setWeather(weatherData);

      // Dynamic background
      const threshold = units === "metric" ? 20 : 60;
      if (weatherData.temp <= threshold) setBg(coldBg);
      else setBg(hotBg);

      const timezoneData = await getTimezone(weatherData.lat, weatherData.lon);
      setTimezone(timezoneData);
    };

    fetchData();
  }, [units, city]);

  const handleUnitsClick = (checked) => {
    setUnits(checked ? "imperial" : "metric");
  };

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  };

  const handleSearch = async (e) => {
    const query = e.currentTarget.value;
    const cities = await getSimilarCities(query);
    setSimilarCities(cities);
  };

  const handleCitySelection = (city) => {
    setCity(city);
    setSimilarCities([]);
  };

  const getFormattedTime = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && timezone && (
          <div className="container">
            <div className="section section__inputs">
              <input
                autoComplete="off"
                onKeyDown={enterKeyPressed}
                onChange={handleSearch}
                type="text"
                name="city"
                placeholder="Enter City..."
              />
              <div className="switch-container">
                <span className="switch-label">C°</span>
                <Switch
                  onChange={handleUnitsClick}
                  checked={units === "imperial"}
                  checkedIcon={false}
                  uncheckedIcon={false}
                  onColor="#6B8E23"
                  offColor="#4682B4"
                  height={36}
                  width={88}
                  handleDiameter={24}
                  borderRadius={18}
                  activeBoxShadow="0 0 2px 3px #6B8E23"
                />
                <span className="switch-label">F°</span>
              </div>
            </div>

            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weatherIcon" />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${units === "metric" ? "C" : "F"}`}</h1>
              </div>
              <div className="time">
                <p>Current Time: {getFormattedTime(timezone.timestamp)}</p>
              </div>
            </div>

            {similarCities.length > 0 && (
              <div className="section section__similar-cities">
                <ul className="similar-cities">
                  {similarCities.map((city) => (
                    <li key={city.id} onClick={() => handleCitySelection(city.name)}>
                      {`${city.name}, ${city.country}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Descriptions weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;