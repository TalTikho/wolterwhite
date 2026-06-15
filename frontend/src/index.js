import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext'; // 🟢 Import provider
import 'bootstrap/dist/css/bootstrap.min.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 🟢 Wrap the App so the button can communicate with the page backgrounds */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);