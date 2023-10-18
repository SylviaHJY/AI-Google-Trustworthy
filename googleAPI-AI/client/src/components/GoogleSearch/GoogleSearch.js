import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GoogleSearchResults = ({ searchTerm}) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/search?q=${searchTerm}`);
        const data = response.data;
        setResults(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    if (searchTerm) {
      fetchResults();
    }
  }, [searchTerm]);
  
  if (!results) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxHeight: '500px', overflow: 'auto' }}>
      <h2>Google Search Results</h2>
      {results.map((result) => (
        <div>
          <h3>{result.title}</h3>
          <p>{result.snippet}</p>
          <a href={result.link}>Read more</a>
        </div>
      ))}
    </div>
  );
};

export default GoogleSearchResults;


