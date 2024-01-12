import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CrearUsuarioAdmin from './UsuariosCrud/CrearUsuarioAdmin.js';
import VerUsuariosAdmin from './UsuariosCrud/VerUsuariosAdmin.js';
import Conocenos from './Conocenos';
import NavigationBar from './NavigationBar';
import Plantel from './Plantel';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <NavigationBar /> */}
        <Routes>
          <Route path="/usuarios/listadousuarios" element={<VerUsuariosAdmin />} />
          <Route path="/usuarios/crearusuario" element={<CrearUsuarioAdmin />} />
          <Route path="/" element={<Home />} />
          <Route path="/conocenos" element={<Conocenos />} />
          <Route path="/plantel" element={<Plantel />} /> 
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
    <NavigationBar/>
      <header className="App-header">
        <h1>Página principal</h1>
        
      </header>
    </div>
  );
}

export default App;
