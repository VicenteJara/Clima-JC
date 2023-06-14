const API_KEY = "52681e9704f975f21d953bc9d1f0e267";

const makeIconURL = (iconId) =>
  `https://openweathermap.org/img/wn/${iconId}@2x.png`;

  const getFormattedWeatherData = async (city, units = "metric") => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`;
  
    const data = await fetch(URL)
      .then((res) => res.json())
      .then((data) => data);
  
    const {
      weather,
      main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
      wind: { speed },
      sys: { country },
      name,
      coord: { lat, lon },
    } = data;
  
    const { description, icon } = weather[0];
  
    return {
      description,
      iconURL: makeIconURL(icon),
      temp,
      feels_like,
      temp_min,
      temp_max,
      pressure,
      humidity,
      speed,
      country,
      name,
      lat,
      lon,
    };
  };
  

const getSimilarCities = async (query) => {
  const URL = `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&appid=${API_KEY}`;

  const data = await fetch(URL)
    .then((res) => res.json())
    .then((data) => data);

  if (data.list) {
    const cities = data.list.map((city) => {
      return {
        id: city.id,
        name: city.name,
        country: city.sys.country,
      };
    });

    return cities;
  } else {
    return [];
  }
};

const getTimezone = async (lat, lon) => {
  const URL = `http://api.timezonedb.com/v2.1/get-time-zone?key=L3ACMLZZ03GO&format=json&by=position&lat=${lat}&lng=${lon}`;

  const data = await fetch(URL)
    .then((res) => res.json())
    .then((data) => data);

  const { countryName, zoneName, timestamp } = data;

  return {
    countryName,
    zoneName,
    timestamp,
  };
};

export { getFormattedWeatherData, getSimilarCities, getTimezone };