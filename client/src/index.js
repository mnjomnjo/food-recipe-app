import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import axios from 'axios';

// Get token from localStorage
const token = localStorage.getItem("token");

// Automatically attach token to all requests
if (token) {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${token}`;
}

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Measure app performance
reportWebVitals();