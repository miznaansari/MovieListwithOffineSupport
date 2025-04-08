import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router";
import ListState from './context/ListState.jsx';
createRoot(document.getElementById('root')).render(
 <BrowserRouter>
    <ListState>

    <App />
    </ListState>
  </BrowserRouter>
)
