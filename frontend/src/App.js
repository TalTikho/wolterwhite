import './style/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import { ApiExample } from './pages/Fetch.js'
import { Home } from './pages/HomePage.js';
import { Login } from './pages/LoginPage.jsx';
import { Register } from './pages/RegisterPage .js';
import { Restaurant } from './pages/RestaurantPage .js';
import { Orders } from './pages/OrdersPage .js';
import { HomeRouter } from './components/HomeRouter.js';
import { ProtectedRoute } from './components/LoginRouter.js';
import { Navbar } from './components/NavBar.js';
import { TokenProvider } from './context/AuthContext.js';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <TokenProvider>
      {/*BrowserRouter acts as the master wrapper that watches the URL*/}
      <BrowserRouter>
        {/* Replaced the old line navbar with modular themed navbar */}
        <div style={{
          position: "relative",
          zIndex: 1
        }} ><Navbar /></div>


        {/* Main wrapper that physically forces the background to update dynamically */}
        <div className="theme-page-wrapper">
          <Routes>
            <Route path="/" element={<HomeRouter />} />
            <Route path="/home" element={<Home />} />
            <Route path="/example" element={<ApiExample />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurants/:id" element={<ProtectedRoute component={<Restaurant />} />} />
            <Route path="/orders" element={<ProtectedRoute component={<Orders />} />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<h2>404 - Page Not Found - Better Call Saul! (505) 503-4455 </h2>} />
          </Routes>
        </div>
      </BrowserRouter>
    </TokenProvider>
  );
}

export default App;