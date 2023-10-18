import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

const ChatGPTResults = ({ searchTerm }) => {
  const [chatGptResult, setChatGptResult] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const chatGptRes = await axios.get('http://localhost:4000/api/chatgpt', { params: { q: searchTerm } });

        setChatGptResult(chatGptRes.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (searchTerm) {
      fetchResults();
    }
  }, [searchTerm]);

  return (
    <div>
      <h2>ChatGPT Result</h2>
      <p className="result-text">{chatGptResult}</p>
    </div>
  );
};

export default ChatGPTResults;