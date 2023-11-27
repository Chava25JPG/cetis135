CREATE DATABASE EscuelaCETIS135;


--USE EscuelaCETIS135;
 -- Creación de la tabla Usuarios

 
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('alumno', 'secretaria', 'administrador') NOT NULL
);

-- Creación de la tabla DocumentosEstudiante
CREATE TABLE DocumentosEstudiante (
    id_documento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo ENUM('ficha', 'preficha', 'inscripcion', 'reinscripcion') NOT NULL,
    fecha_subida DATE NOT NULL,
    ruta_archivo VARCHAR(255) NOT NULL,
    estado ENUM('pendiente', 'validado', 'rechazado') NOT NULL,
    comentario_rechazo TEXT,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

-- Creación de la tabla AvisosConvocatorias
CREATE TABLE AvisosConvocatorias (
    id_aviso INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_publicacion DATE NOT NULL,
    imagen_url VARCHAR(255),
    enlace VARCHAR(255)
);

-- Creación de la tabla RecursosImportantes
CREATE TABLE RecursosImportantes (
    id_recurso INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_publicacion DATE NOT NULL,
    archivo_url VARCHAR(255)
);

-- Creación de la tabla Especialidades
CREATE TABLE Especialidades (
    id_especialidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_especialidad VARCHAR(255) NOT NULL,
    descripcion TEXT
);
