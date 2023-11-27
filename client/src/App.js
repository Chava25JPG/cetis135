import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

import Conocenos from './Conocenos';
import NavigationBar from './NavigationBar';

function App() {
  return (
    <Router>
      
      <div className="App">
      <NavigationBar />
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/conocenos" element={<Conocenos />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <header className="App-header">
      <h1>Página principal</h1>
      
    </header>
  );
}

export default App;
