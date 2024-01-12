const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;
const cors = require('cors');
const mysql = require('mysql');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Zaragoza2525',
  database: 'EscuelaCETIS135',
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// Configura CORS para permitir solicitudes del servidor de desarrollo de React
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Sirve los archivos estáticos de la aplicación React
app.use(express.static(path.join(__dirname, 'client/build')));

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Ruta para la creación de usuarios
app.post('/api/create-user', (req, res) => {
  const { nombre, apellidoPaterno, apellidoMaterno, correo, contraseña, rol } = req.body;

  if (!nombre || !apellidoPaterno || !correo || !contraseña || !rol) {
    return res.status(400).json({ error: 'Faltan datos del usuario.' });
  }

  // Obtener el año actual
  const year = new Date().getFullYear();

  // Obtener el número de plantel
  const numeroPlantel = 135; // Puedes cambiarlo según tus necesidades

  // Crear la matrícula utilizando la fecha y hora actual
  const timestamp = Date.now();
  const matricula = `${year}${numeroPlantel}${rol === 'participante' ? '01' : '02'}${timestamp.toString().slice(-10)}`;

  // Insertar el nuevo usuario en la base de datos
  const query = 'INSERT INTO Usuarios (matricula, nombre, apellidoPaterno, apellidoMaterno, correo, contraseña, rol) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [matricula, nombre, apellidoPaterno,apellidoMaterno , correo, contraseña, rol], (err, result) => {
    if (err) {
      console.error('Error al insertar usuario:', err);
      return res.status(500).json({ error: 'Error al crear el usuario.' });
    } else {
      console.log('Usuario creado exitosamente.');
      return res.status(201).json({ message: 'Usuario creado exitosamente.' });
    }
  });
});

// Ruta para obtener todos los usuarios
app.get('/api/get-users', (req, res) => {
  const query = 'SELECT * FROM Usuarios';

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      return res.status(500).json({ error: 'Error al obtener usuarios.' });
    } else {
      //console.log(result); // Agrega esta línea para imprimir la respuesta en la consola
      return res.status(200).json({ users: result });
    }
  });
});

// Otras rutas
app.get('/api/conocenos', (req, res) => {
  res.json({ message: '¡Bienvenidos a Conócenos!' });
});

app.get('/api/plantel', (req, res) => {
  res.json({ message: '¡Bienvenidos a Plantel!' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
