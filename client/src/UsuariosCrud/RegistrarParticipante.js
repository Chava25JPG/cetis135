import React, { useState } from 'react';
import axios from 'axios';

const UserParticipanteForm = () => {
  const [userData, setUserData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fecha_nacimiento: '',
    lugar_nacimiento: '',
    CURP: '',
    correo: '',
    contraseña: '',
    rol: 'participante',
  });
  const [isUserCreated, setIsUserCreated] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/create-user-participante', userData);
      console.log(response.data);
      alert('Usuario creado exitosamente. Revisa tu correo para el código de verificación.');
      setIsUserCreated(true); // Actualiza el estado para mostrar el campo de código de verificación
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      alert('Hubo un error al crear el usuario.');
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/verify-code', { correo: userData.correo, codigoVerificacion: verificationCode });
      console.log(response.data);
      alert('Código verificado exitosamente.');
      // Procesa aquí el éxito de la verificación, como redirigir al usuario o mostrar más información
    } catch (error) {
      console.error('Error al verificar el código:', error);
  
      // Verifica si el error es debido a una respuesta del servidor
      if (error.response) {
        // El servidor devolvió una respuesta fuera del rango de 2xx
        console.error(`Error del servidor (estado ${error.response.status}):`, error.response.data);
        alert(`Error al verificar el código: ${error.response.data.error || error.response.statusText}`);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor:', error.request);
        alert('Error al verificar el código: No se recibió respuesta del servidor.');
      } else {
        // Algo más causó un error al hacer la solicitud
        console.error('Error al hacer la solicitud:', error.message);
        alert(`Error al verificar el código: ${error.message}`);
      }
  
      // Para depurar: muestra información detallada del error
      console.error('Detalles del error:', error.config);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
      <input type="text" name="nombre" value={userData.nombre} onChange={handleChange} placeholder="Nombre" required />
      <input type="text" name="apellidoPaterno" value={userData.apellidoPaterno} onChange={handleChange} placeholder="Apellido Paterno" required />
      <input type="text" name="apellidoMaterno" value={userData.apellidoMaterno} onChange={handleChange} placeholder="Apellido Materno" required />
      <input type="date" name="fecha_nacimiento" value={userData.fecha_nacimiento} onChange={handleChange} required />
      <input type="text" name="lugar_nacimiento" value={userData.lugar_nacimiento} onChange={handleChange} placeholder="Lugar de Nacimiento" required />
      <input type="text" name="CURP" value={userData.CURP} onChange={handleChange} placeholder="CURP" required />
      <input type="email" name="correo" value={userData.correo} onChange={handleChange} placeholder="Correo Electrónico" required />
      <input type="password" name="contraseña" value={userData.contraseña} onChange={handleChange} placeholder="Contraseña" required />
        <button type="submit">Crear Usuario</button>
      </form>
      
      {isUserCreated && (
        <form onSubmit={handleVerificationSubmit}>
          <input
            type="text"
            value={verificationCode}
            onChange={handleVerificationCodeChange}
            placeholder="Código de Verificación"
            required
          />
          <button type="submit">Verificar Código</button>
        </form>
      )}
    </>
  );
};

export default UserParticipanteForm;
