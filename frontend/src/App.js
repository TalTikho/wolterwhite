import './style/App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import { ApiExample } from './pages/Fetch.js';
import { Login } from './pages/LoginPage.js';
import { Register } from './pages/RegisterPage.js';
import { RestaurantPage } from './pages/RestaurantPage.js';
import { Orders } from './pages/OrdersPage.js';
import { HomeRouter } from './components/HomeRouter.js';
import { ProtectedRoute } from './components/LoginRouter.js';
import { Navbar } from './components/NavBar.js';
import { AdminPage } from './pages/AdminPage.js';
import { TokenProvider, useAuthContext } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { RestaurantFilterProvider } from './context/RestaurantFilterContext.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const LocalAdminRoute = ({ component }) => {
  const { token } = useAuthContext();
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    
    if (payload?.username?.toLowerCase() === "admin1") {
      return component;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  return <Navigate to="/" />;
};

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
                <Route path="/example" element={<ApiExample />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/restaurants/:id" element={<ProtectedRoute component={<RestaurantPage />} />} />
                <Route path="/orders" element={<ProtectedRoute component={<Orders />} />} />
                <Route path="/admin" element={<LocalAdminRoute component={<AdminPage />} />} />
                <Route 
                  path="*" 
                  element={
                    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                      <h2>404 - Page Not Found</h2>
                      <p>Better Call Saul!</p>
                    </div>
                  } 
                />
              </Routes>
            </div>
          </BrowserRouter>
        </RestaurantFilterProvider>
      </ThemeProvider>
    </TokenProvider>
  );
}

export default App;