import './App.css';
import React, { useState } from 'react';
import SearchBar from './components/SearchBar.js';
import ChatGPTResults from './components/ChatGPT/ChatGPT.js';
import GoogleSearchResults from './components/GoogleSearch/GoogleSearch.js';
import KeywordSearchResults from './components/KeywordSearch/KeywordSearch.js';

import { 
  Card, 
  CardContent, 
  Grid
} from '@mui/material';

function App() {

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  return (
    <div className="App">
      <header className="App-header">
      <h1 className='APP-title'>
        <b>ChatGPT VS Google</b>
      </h1>
      <div>
      <p>
      How trustworthy is ChatGPT? Explore the AI's responses, compare them with Google's search results <br/>for the same query, and even further, with results extracted from your query's keywords. <br/>
      The average similarity score will be displayed at the top and the top three most similar Google results will be highlighted. <br/>Dive in, experiment, and see how close or far AI is from human-like responses!
      </p>
      </div>
      </header>
      <br/>
      <br/>
        <SearchBar onSearch={handleSearch} />
        <br/>
        <Grid container spacing={2}>
          <Grid item xs={4}>
           <Card className="chatgpt-card">
            <CardContent>
             <ChatGPTResults searchTerm={searchTerm} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className="googleresult-card">
            <CardContent>
             <GoogleSearchResults searchTerm={searchTerm}/>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className="keyword-card">
            <CardContent>
            <KeywordSearchResults searchTerm={searchTerm}/>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
