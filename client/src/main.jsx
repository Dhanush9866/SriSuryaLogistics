import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// Always open at the top on load/refresh (don't restore the old scroll position or jump to a #section)
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
if (window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search);
window.scrollTo(0, 0);
window.addEventListener('load', () => window.scrollTo(0, 0));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
