import React from 'react';

const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      Find countries: <input value={search} onChange={handleSearchChange} />
    </div>
  );
};

export default Filter;
