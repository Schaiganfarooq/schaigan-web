import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';

// NOTE: intentionally not wrapping in <React.StrictMode>. Its dev-only
// double-mount disposes/recreates the WebGL context and can leave the
// hero canvas at 0x0. Three.js apps standardly opt out of StrictMode.
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
