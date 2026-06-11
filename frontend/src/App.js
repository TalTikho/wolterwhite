import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import fetch, { ApiExample } from './components/fetch.js'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <code>src/App.js</code> 
        </p>
        <p><ApiExample /></p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
