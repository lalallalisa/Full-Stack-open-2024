import React from 'react';

const CountriesDisplay = ({ countries, handleShowCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length > 1) {
    return (
      <ul>
        {countries.map(country => (
          <li key={country.cca3}>
            {country.name.common} <button onClick={() => handleShowCountry(country)}>show</button>
          </li>
        ))}
      </ul>
    );
  } else {
    return <p>No matches, specify another filter</p>;
  }
};

export default CountriesDisplay;
