import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import '../style.css';

createRoot(document.getElementById('react-root')).render(
  <React.StrictMode><App /></React.StrictMode>
);
