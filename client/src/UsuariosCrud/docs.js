import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardAlumno = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [tipo, setTipo] = useState('ficha');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirigir a /login si no hay token
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTipoChange = (e) => {
    setTipo(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('tipo', tipo);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado o la sesión ha expirado.');
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      const response = await axios.post('http://localhost:3001/api/upload', formData, config);
      alert('Archivo subido exitosamente.');
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert('Error al subir el archivo.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirigir al menú principal tras cerrar sesión
  };

  return (
    <div>
      <h2>Dashboard Alumno</h2>
      <button onClick={handleLogout}>Cerrar sesión</button>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".pdf" onChange={handleFileChange} required />
        <select value={tipo} onChange={handleTipoChange}>
          <option value="ficha">Ficha</option>
          <option value="inscripcion">Inscripción</option>
          <option value="reinscripcion">Reinscripción</option>
        </select>
        <button type="submit">Subir Documento</button>
      </form>
    </div>
  );
};

export default DashboardAlumno;
