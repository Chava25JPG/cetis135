import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('alumno');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        correo: email,
        contraseña: password,
        rol: activeTab,
      });
  
      localStorage.setItem('token', response.data.token);
      alert('Inicio de sesión exitoso.');
      navigate('/alumno');
    } catch (error) {
      setError(error.response?.data?.error || 'Error desconocido al iniciar sesión.');
    }
  };

  return (
    <div className="login-container">
      <div className="tabs">
        <button onClick={() => setActiveTab('administrador')}>Administradores</button>
        <button onClick={() => setActiveTab('secretaria')}>Secretaria</button>
        <button onClick={() => setActiveTab('alumno')}>Alumnos</button>
        <button onClick={() => setActiveTab('participante')}>Participantes</button>
      </div>
      <div className="login-form">
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Correo electrónico" 
            required 
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Contraseña" 
            required 
          />
          <button type="submit">Iniciar sesión</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
