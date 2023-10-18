import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KeywordSearchResults = ({searchTerm }) => {
  const [results, setResults] = useState([]);
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/keywordSearch?q=${searchTerm}`);
        const data = response.data.results;
        setResults(data);
        setKeywords(response.data.keywordQuery);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    if (searchTerm) {
      fetchResults();
    }
  }, [searchTerm]);

  return (
    <div style={{ maxHeight: '500px', overflow: 'auto' }}>
      <h2>Keywords Search Results</h2>
      <p>Keywords: {keywords}</p>
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

export default KeywordSearchResults;

