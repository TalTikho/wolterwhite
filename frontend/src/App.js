import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import React from 'react';
import  { ApiExample } from './pages/Fetch.js'
import { Home } from './pages/HomePage.js';
import { Login } from './pages/LoginPage.js';
import { Register } from './pages/RegisterPage .js';
import { Restaurant } from './pages/RestaurantPage .js';
import { Orders } from './pages/OrdersPage .js';
import { HomeRouter } from './components/HomeRouter.js';
import { ProtectedRoute } from './components/LoginRouter.js';
import { TokenProvider } from './context/AuthContext.js';
import 'bootstrap/dist/css/bootstrap.min.css'
function App() {
  return (
    <TokenProvider>
    {/*BrowserRouter acts as the master wrapper that watches the URL*/}
    <BrowserRouter>
      {/*Anything placed outside <Routes> (like a NavBar) will show on EVERY page */}
      <nav style={{ padding: '10px', background: '#333', color: 'yellow' }}>
        <h3>Wolterwhite Delivery</h3>
        <Link to="/example">Watch Our beautiful restaurant list (ApiExample)</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}
      </nav>

      {/*The Routes block acts as the map. It looks at the URL and chooses one Route to draw */}
      <Routes>
        <Route path="/" element={<HomeRouter />} />
        <Route path="/" element={<Home />} />
        <Route path="/example" element={<ApiExample />} />
        <Route path="/register" element={<Register />} />
        {/*protected comps*/}
        <Route path="/restaurants/:id" element={<ProtectedRoute component={<Restaurant />} />} />
        <Route path="/orders" element={<ProtectedRoute component={<Orders />} />} />

        <Route path="/login" element={<Login />} /> 
        {/* <Route path="/restaurants" element={<RestaurantList />} /> */}
        {/*A catch-all route for bad URLs */}
        <Route path="*" element={<h2>404 - Page Not Found - Better Call Saul! (505) 503-4455 </h2>} />
      </Routes>
    </BrowserRouter>
    </TokenProvider>
  );
}

export default App;
