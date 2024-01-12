import React, { useState } from 'react';

function CreateUserForm() {
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [rol, setRol] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, apellidoPaterno,apellidoMaterno, correo, contraseña, rol }),
      });

      if (response.ok) {
        setMensaje('Usuario creado exitosamente.');
      } else {
        const data = await response.json();
        setMensaje(`Error al crear el usuario: ${data.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      setMensaje('Error de red al intentar crear el usuario.');
    }
  };

  return (
    <div>
      <h2>Crear Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <label>
          Apellido Paterno:
          <input type="text" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} />
        </label>
        <label>
          Apellido Materno:
          <input type="text" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} />
        </label>
        <label>
          Correo:
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        </label>
        <label>
          Contraseña:
          <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} />
        </label>
        <label>
          Rol:
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="">Selecciona un rol</option>
            <option value="alumno">Alumno</option>
            <option value="secretaria">Secretaria</option>
            <option value="administrador">Administrador</option>
            <option value="participante">Participante</option>
          </select>
        </label>
        <button type="submit">Crear Usuario</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default CreateUserForm;
