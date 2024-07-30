import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './Filter';
import CountriesDisplay from './CountriesDisplay';
import CountriesDetail from './CountriesDetail';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const capital = selectedCountry.capital[0];
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${OPENWEATHER_API_KEY}&units=metric`)
        .then(response => {
          setWeather(response.data);
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
        });
    }
  }, [selectedCountry, OPENWEATHER_API_KEY]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    if (event.target.value === '') {
      setFilteredCountries([]);
      setSelectedCountry(null);
      setWeather(null);
    } else {
      const filtered = countries.filter(country =>
        country.name.common.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  };

  const handleShowCountry = (country) => {
    setSelectedCountry(country);
    setFilteredCountries([country]);
  };

  return (
    <div>
      <h1>Country Finder</h1>
      <Filter search={search} handleSearchChange={handleSearchChange} />
      {selectedCountry ? (
        <CountriesDetail country={selectedCountry} weather={weather} />
      ) : (
        <CountriesDisplay countries={filteredCountries} handleShowCountry={handleShowCountry} />
      )}
    </div>
  );
};

export default App;
