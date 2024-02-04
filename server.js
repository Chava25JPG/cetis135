const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;
const cors = require('cors');
const mysql = require('mysql');
const enviarCorreoVerificacion = require('./SendMail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
  const { nombre, apellidoPaterno, apellidoMaterno, fecha_nacimiento, lugar_nacimiento, CURP, correo, contraseña, rol } = req.body;

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
  const query = 'INSERT INTO Usuarios (matricula, nombre, apellidoPaterno, apellidoMaterno, fecha_nacimiento, lugar_nacimiento, CURP,correo, contraseña, rol) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [matricula, nombre, apellidoPaterno,apellidoMaterno ,fecha_nacimiento, lugar_nacimiento, CURP, correo, contraseña, rol], (err, result) => {
    if (err) {
      console.error('Error al insertar usuario:', err);
      return res.status(500).json({ error: 'Error al crear el usuario.' });
    } else {
      console.log('Usuario creado exitosamente.');
      return res.status(201).json({ message: 'Usuario creado exitosamente.' });
    }
  });
});


//Ruta para crear usuarios general:
app.post('/api/mail-verification', (req, res) => {
  const { nombre, apellidoPaterno, apellidoMaterno, correo, contraseña } = req.body;
  rol = 'alumno';

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

//Ruta para crear participantes
app.post('/api/create-user-participante', (req, res) => {
  const { nombre, apellidoPaterno, apellidoMaterno,fecha_nacimiento,lugar_nacimiento,CURP, correo, contraseña, rol } = req.body;
  
  // Generar código de verificación de 4 dígitos
  const codigoVerificacion = Math.floor(1000 + Math.random() * 9000);

  // Obtener el año actual
  const year = new Date().getFullYear();

  // Obtener el número de plantel
  const numeroPlantel = 135; // Puedes cambiarlo según tus necesidades

  // Crear la matrícula utilizando la fecha y hora actual
  const timestamp = Date.now();
  const matricula = `${year}${numeroPlantel}${rol === 'participante' ? '01' : '02'}${timestamp.toString().slice(-10)}`;
  
  // Guardar código de verificación en la base de datos
  const query = 'INSERT INTO Usuarios (nombre, apellidoPaterno, apellidoMaterno, fecha_nacimiento,lugar_nacimiento,CURP, rol, correo, contraseña, matricula, codigo_veri) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [nombre, apellidoPaterno, apellidoMaterno, fecha_nacimiento,lugar_nacimiento,CURP, rol, correo, contraseña, matricula, codigoVerificacion], (err, result) => {
    if (err) {
      console.error('Error al insertar usuario:', err);
      return res.status(500).json({ error: 'Error al crear el usuario.' });
    } else {
      console.log('Usuario creado exitosamente.');

      // Envía el correo de verificación
      enviarCorreoVerificacion(correo, codigoVerificacion);

      return res.status(201).json({ message: 'Usuario creado exitosamente.' });
    }
  });
});

app.post('/api/verify-code', (req, res) => {
  const { correo, codigoVerificacion } = req.body;
  const codigoVerificacionStr = String(codigoVerificacion);

  // Buscar usuario por correo
  const query = 'SELECT * FROM Usuarios WHERE correo = ?';

  connection.query(query, [correo], (err, results) => {
    if (err) {
      console.error('Error al buscar el usuario:', err);
      return res.status(500).json({ error: 'Error al buscar el usuario.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const usuario = results[0];

    // Verificar el código de verificación
    if (String(usuario.codigo_veri) === codigoVerificacionStr) {
      // Actualizar el usuario como verificado
      const updateQuery = 'UPDATE Usuarios SET verificado = 1 WHERE correo = ?';

      connection.query(updateQuery, [correo], (updateErr, updateResults) => {
        if (updateErr) {
          console.error('Error al actualizar el usuario:', updateErr);
          return res.status(500).json({ error: 'Error al actualizar el usuario.' });
        }

        return res.json({ message: 'Código verificado exitosamente y usuario actualizado.' });
      });
    } else {
      return res.status(400).json({ error: 'Código de verificación incorrecto.' });
    }
  });
});



app.post('/api/login', async (req, res) => {
  const { correo, contraseña, rol } = req.body;

  try {
    const query = 'SELECT * FROM Usuarios WHERE correo = ? AND rol = ?';
    const user = await new Promise((resolve, reject) => {
      connection.query(query, [correo, rol], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const match = await bcrypt.compare(contraseña, user.contraseña);
    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    if (user.verificado !== 1) {
      return res.status(401).json({ error: 'El correo no ha sido verificado.' });
    }

    // Generar un JWT
    const token = jwt.sign({ id: user.id, rol: user.rol }, 'tuSuperSecreto', { expiresIn: '1h' });

    res.json({ message: 'Inicio de sesión exitoso', token: token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
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
