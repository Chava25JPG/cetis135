import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.css'; // Asegúrate de crear este archivo CSS también

const NavigationBar = () => {
  return (
    <nav className="navigation-bar">
      <div className="logo">CETis No. 13</div>
      <div className="navigation-links">
        <NavLink exact to="/" activeClassName="active-link">INICIO</NavLink>
        <NavLink to="/plantel" activeClassName="active-link">PLANTEL</NavLink>
        <NavLink to="/conocenos" activeClassName="active-link">CONOCENOS</NavLink>
        {/* Agregar más enlaces de navegación aquí según sea necesario */}
        <NavLink to="/contactanos" activeClassName="active-link">CONTÁCTANOS</NavLink>
      </div>
    </nav>
  );
};

export default NavigationBar;
