import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import React from 'react';
import  { ApiExample } from './components/Fetch.js'
import { Home } from './components/Home.js';
function App() {
  return (
    //BrowserRouter acts as the master wrapper that watches the URL
    <BrowserRouter>
      {/*Anything placed outside <Routes> (like a NavBar) will show on EVERY page */}
      <nav style={{ padding: '10px', background: '#333', color: 'yellow' }}>
        <h3>Wolterwhite Delivery</h3>
        <Link to="/">Home</Link> |{" "}
        <Link to="/example">Watch Our beautiful restaurant list (ApiExample)</Link> |{" "}
      </nav>

      {/*The Routes block acts as the map. It looks at the URL and chooses one Route to draw */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/example" element={<ApiExample />} />

        {/*<Route path="/login" element={<Login />} /> */}
        {/* <Route path="/restaurants" element={<RestaurantList />} /> */}
        {/*A catch-all route for bad URLs (to be a page)*/}
        <Route path="*" element={<h2>404 - Page Not Found - Better Call Saul! (505) 503-4455 </h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
