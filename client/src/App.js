import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CrearUsuarioAdmin from './UsuariosCrud/CrearUsuarioAdmin.js';
import VerUsuariosAdmin from './UsuariosCrud/VerUsuariosAdmin.js';
import Conocenos from './Conocenos';
import NavigationBar from './NavigationBar';
import Plantel from './Plantel';
import Login from './UsuariosCrud/Login.js'
import DashboardAlumno from './UsuariosCrud/docs.js'
import DashboardSecretaria from './UsuariosCrud/DashSecretaria.js'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import UserParticipanteForm from './UsuariosCrud/RegistrarParticipante.js'

function App() {
  return (
    <Router>
      <div className="App">
        {/* <NavigationBar /> */}
        <Routes>
          <Route path="/dsecretaria" element={<DashboardSecretaria />} />
          <Route path="/alumno" element={<DashboardAlumno />} />
          <Route path="/login" element={<Login />} />
          <Route path="/crear/participante" element={<UserParticipanteForm />} />
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
  // Configuraciones para el slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <div>
      <NavigationBar />
      <header className="App-header">
        <h1>Página principal</h1>
        <Slider {...settings}>
          {/* Aquí agregas tus imágenes */}
          <div>
            <img src="./images/346292750_606254057903359_596575520566804662_n.png" alt="Imagen 1" />
          </div>
          <div>
            <img src="./images/366294960_758551689645244_7313834964650239879_n.jpg" alt="Imagen 2" />
          </div>
          {/* Agrega más divs con imágenes según sea necesario */}
        </Slider>
      </header>
    </div>
  );
}

export default App;
