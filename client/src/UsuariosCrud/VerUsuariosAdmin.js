import React, { useEffect, useState } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hacer la solicitud a la API cuando el componente se monta
    fetch('http://localhost:3001/api/get-users')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setUsers(data.users);
      })
      .catch(err => {
        console.error('Error al obtener usuarios:', err);
        setError('Error al obtener usuarios. Por favor, inténtalo de nuevo más tarde.');
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Listado de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Matrícula</th>
            <th>Correo</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id_usuario}>
              <td>{user.nombre}</td>
              <td>{user.apellidoPaterno}</td>
              <td>{user.apellidoMaterno}</td>
              <td>{user.matricula}</td>
              <td>{user.correo}</td>
              <td>{user.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
