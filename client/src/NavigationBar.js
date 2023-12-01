import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.css'; // Asegúrate de crear este archivo CSS también

const NavigationBar = () => {
  return (
    <nav className="navigation-bar">
      <div className="logo">CETis No. 135</div>
      <div className="navigation-links">
        <NavLink exact={"true"} to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>
          INICIO
        </NavLink>
        <NavLink to="/plantel" className={({ isActive }) => isActive ? 'active-link' : ''}>
          PLANTEL
        </NavLink>
        <NavLink to="/conocenos" className={({ isActive }) => isActive ? 'active-link' : ''}>
          CONOCENOS
        </NavLink>
        {/* Agregar más enlaces de navegación aquí según sea necesario */}
        <NavLink to="/contactanos" className={({ isActive }) => isActive ? 'active-link' : ''}>
          CONTÁCTANOS
        </NavLink>
      </div>
    </nav>
  );
};

export default NavigationBar;
