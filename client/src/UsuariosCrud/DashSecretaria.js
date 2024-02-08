import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardSecretaria = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState('');
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('');

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/especialidades');
        if (response.data && Array.isArray(response.data.especialidades)) {
          setEspecialidades(response.data.especialidades);
        } else {
          console.error('La respuesta no es un arreglo:', response.data);
          setEspecialidades([]);
        }
      } catch (error) {
        console.error('Error al obtener especialidades:', error);
        setEspecialidades([]);
      }
    };

    fetchEspecialidades();
  }, []);

  const handleEspecialidadSeleccionada = async (id) => {
    setEspecialidadSeleccionada(id);
    setAlumnoSeleccionado('');
    try {
        const response = await axios.get(`http://localhost:3001/api/alumnos-por-especialidad/${id}`);
        // Asegúrate de que la respuesta contiene un array
        if (response.data && Array.isArray(response.data)) {
          setAlumnos(response.data);
        } else {
          throw new Error('Respuesta no contiene un array');
        }
      } catch (error) {
        console.error('Error al obtener alumnos:', error);
        setAlumnos([]); // En caso de error, establece un array vacío
      }
    };

  const handleAlumnoSeleccionado = async (id) => {
    setAlumnoSeleccionado(id);
    try {
        const response = await axios.get(`http://localhost:3001/api/documentos-por-alumno/${id}`);
        // Asegúrate de que la respuesta contiene un array
        if (response.data && Array.isArray(response.data)) {
          setDocumentos(response.data);
        } else {
          throw new Error('Respuesta no contiene un array');
        }
      } catch (error) {
        console.error('Error al obtener documentos:', error);
        setDocumentos([]); // En caso de error, establece un array vacío
      }
    };

    const openDocument = (rutaArchivo) => {
        // Codifica la ruta del archivo para pasarla como un parámetro de consulta
        const encodedRutaArchivo = encodeURIComponent(rutaArchivo);
        const url = `http://localhost:3001/api/documentos?rutaArchivo=${encodedRutaArchivo}`;
        window.open(url, '_blank');
    };
  return (
    <div>
      <h2>Dashboard Secretaria</h2>
      <h3>Especialidades</h3>
      {especialidades.length > 0 ? (
        especialidades.map((especialidad) => (
            <button
            key={especialidad.id_especialidad} // Asegúrate de que id_especialidad es único
            onClick={() => handleEspecialidadSeleccionada(especialidad.id_especialidad)}
            >
            {especialidad.nombre_especialidad}
            </button>
        ))
        ) : (
        <p>No se encontraron especialidades.</p>
        )}

      {especialidadSeleccionada && (
        <>
          <h3>Alumnos</h3>
          {alumnos.length > 0 ? (
            alumnos.map((alumno) => (
                <div key={alumno.id}> 
                <button onClick={() => handleAlumnoSeleccionado(alumno.id)}>
                    {alumno.nombre} {alumno.apellidoP}
                </button>
                </div>
            ))
            ) : (
            <p>No hay alumnos que hayan enviado documentos para esta especialidad.</p>
            )}
        </>
      )}

      {alumnoSeleccionado && (
        <>
          <h3>Documentos del alumno</h3>
          {documentos.length > 0 ? (
            documentos.map((documento) => {
              // Asegúrate de utilizar la propiedad correcta para la ruta del archivo
              return (
                <div key={documento.id}>
                  <button onClick={() => openDocument(documento.rutaArchivo)}>
                    Ver documento
                  </button>
                </div>
              );
            })
          ) : (
            <p>Este alumno no ha enviado documentos.</p>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardSecretaria;