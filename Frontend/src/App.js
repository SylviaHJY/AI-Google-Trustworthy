import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import QuestionPage from './components/questionPage';
import LastPage from './components/LastPage';

function App() {
  return (
    <Router>
     <div className="App">
      <header className="App-header">
       <h1 className='APP-title'>
          Welcome to AI-Lab!
       </h1>
      </header>
      <br />
      <br />
      <div className='App-body'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/answers/number/:num' element={<QuestionPage />} />
          <Route path='/lastPage' element={<LastPage />} />
        </Routes>
       </div>
       <footer className='App-footer'></footer>
      </div>
    </Router>
  );
}

export default App;
