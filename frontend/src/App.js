import './style/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import { ApiExample } from './pages/Fetch.js';
import { Login } from './pages/LoginPage.js';
import { Register } from './pages/RegisterPage.js';
import { RestaurantPage } from './pages/RestaurantPage.js';
import { Orders } from './pages/OrdersPage.js';
import { HomeRouter } from './components/HomeRouter.js';
import { ProtectedRoute } from './components/LoginRouter.js';
import { AdminPage } from './pages/AdminPage.js';
import { AdminRoute } from './components/AdminRoute.js';
import { TokenProvider } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { RestaurantFilterProvider } from './context/RestaurantFilterContext.js';
import { Navbar } from './components/NavBar.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <TokenProvider>
      <ThemeProvider>
        <RestaurantFilterProvider>
          <BrowserRouter>
            <Navbar />
            <div className="theme-page-wrapper">
              <Routes>
                <Route path="/" element={<HomeRouter />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/example" element={<ApiExample />} />

                <Route path="/restaurants/:id" element={<ProtectedRoute component={<RestaurantPage />} />} />
                <Route path="/orders" element={<ProtectedRoute component={<Orders />} />} />

                <Route
                  path="/admin"
                  element={<AdminRoute component={<AdminPage />} />}
                />

                <Route path="*" element={<h2>404 - Page Not Found</h2>} />
              </Routes>
            </div>
          </BrowserRouter>
        </RestaurantFilterProvider>
      </ThemeProvider>
    </TokenProvider>
  );
}

export default App;