import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      setError(null);
      onSearch(searchTerm.trim());
    } else {
      setError('Please enter a valid search term');
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      {error && <p>{error}</p>}
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
