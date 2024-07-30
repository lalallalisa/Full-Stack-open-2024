import React from 'react';

const Weather = ({ capital, weather }) => {
  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>Temperature: {weather.main.temp} °C</p>
      <p>Weather: {weather.weather[0].description}</p>
      <p>Wind: {weather.wind.speed} m/s</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={`Weather icon`}
      />
    </div>
  );
};

export default Weather;
