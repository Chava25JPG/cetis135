const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require('cors');
const mysql = require('mysql');
const enviarCorreoVerificacion = require('./SendMail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');

// Configuración de Multer para almacenar archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '/uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Prefijo de fecha para evitar nombres duplicados
  }
});

const upload = multer({ storage: storage });


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


//subir documentos
app.post('/api/upload', upload.single('archivo'), (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Suponiendo que el token viene en el encabezado como "Bearer <token>"
  jwt.verify(token, 'tuSuperSecreto', async (err, decoded) => {
    if (err) {
      return res.status(403).send('Error en la autenticación del token.');
    }

    // Asegúrate de que el usuario es un alumno
    if (decoded.rol !== 'alumno') {
      return res.status(403).send('Acceso denegado: usuario no es alumno.');
    }

    const id_usuario = decoded.id; // Asegúrate de que el token contiene el campo id del usuario
    const { tipo } = req.body; // El tipo de documento: ficha, inscripcion, reinscripcion
    const ruta_archivo = req.file.path;
    const fecha_subida = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    // Comprobación adicional para asegurarse de que id_usuario no es null
    if (!id_usuario) {
      return res.status(400).send('El ID del usuario no puede ser nulo.');
    }

    // Inserta los datos del documento en la base de datos
    try {
      const query = 'INSERT INTO DocumentosEstudiante (id_usuario, tipo, fecha_subida, ruta_archivo, estado) VALUES (?, ?, ?, ?, ?)';
      const valores = [id_usuario, tipo, fecha_subida, ruta_archivo, 'Pendiente'];

      connection.query(query, valores, (error, results) => {
        if (error) {
          console.error('Error al insertar documento:', error);
          return res.status(500).send('Error al guardar la información del archivo en la base de datos.');
        }
        return res.status(201).send('Documento subido con éxito.');
      });
    } catch (error) {
      console.error('Error al subir documento:', error);
      res.status(500).send('Error interno del servidor.');
    }
  });
});




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

app.post('/api/create-user-participante', async (req, res) => {
  const { nombre, apellidoPaterno, apellidoMaterno, fecha_nacimiento, lugar_nacimiento, CURP, id_especialidad, correo, contraseña, rol } = req.body;
  
  // Generar código de verificación de 4 dígitos
  const codigoVerificacion = Math.floor(1000 + Math.random() * 9000);

  // Obtener el año actual
  const year = new Date().getFullYear();

  // Obtener el número de plantel
  const numeroPlantel = 135; // Puedes cambiarlo según tus necesidades

  // Crear la matrícula utilizando la fecha y hora actual
  const timestamp = Date.now();
  const matricula = `${year}${numeroPlantel}${rol === 'participante' ? '01' : '02'}${timestamp.toString().slice(-10)}`;

  try {
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseñaHash = await bcrypt.hash(contraseña, salt);

    // Guardar código de verificación en la base de datos
    const query = 'INSERT INTO Usuarios (nombre, apellidoPaterno, apellidoMaterno, fecha_nacimiento, lugar_nacimiento, CURP, rol, correo, contraseña, matricula, codigo_veri, id_especialidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [nombre, apellidoPaterno, apellidoMaterno, fecha_nacimiento, lugar_nacimiento, CURP, rol, correo, contraseñaHash, matricula, codigoVerificacion, id_especialidad], (err, result) => {if (err) {
        console.error('Error al insertar usuario:', err);
        return res.status(500).json({ error: 'Error al crear el usuario.' });
      } else {
        console.log('Usuario creado exitosamente.');

        // Envía el correo de verificación
        enviarCorreoVerificacion(correo, codigoVerificacion);

        return res.status(201).json({ message: 'Usuario creado exitosamente.' });
      }
    });
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud.' });
  }
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


app.get('/api/alumnos-por-especialidad/:especialidadId', (req, res) => {
  const { especialidadId } = req.params;
  
  // Asegúrate de que especialidadId es un número
  if (isNaN(especialidadId)) {
    return res.status(400).send('El ID de la especialidad debe ser un número.');
  }

  const query = `
    SELECT u.id_usuario, u.nombre, u.apellidoPaterno,u.apellidoMaterno, u.matricula
    FROM Usuarios u
    JOIN Especialidades e ON u.id_especialidad = e.id_especialidad
    WHERE e.id_especialidad = ?
    AND u.rol IN ('alumno', 'participante')
  `;

  connection.query(query, [especialidadId], (error, results) => {
    if (error) {
      console.error('Error al obtener alumnos por especialidad:', error);
      return res.status(500).send('Error al obtener alumnos por especialidad.');
    }

    // Convertir los resultados en un formato más amigable si es necesario
    const alumnos = results.map(alumno => ({
      id: alumno.id_usuario,
      nombre: alumno.nombre,
      apellidoP: alumno.apellidoPaterno,
      apellidoM: alumno.apellidoMaterno,
      matricula: alumno.matricula,
    }));

    res.json(alumnos);
  });
});



app.get('/api/documentos-por-alumno/:alumnoId', (req, res) => {
  const { alumnoId } = req.params;

  // Asegúrate de que alumnoId es un número
  if (isNaN(alumnoId)) {
    return res.status(400).send('El ID del alumno debe ser un número.');
  }

  const query = `
    SELECT d.id_documento, d.tipo, d.fecha_subida, d.ruta_archivo, d.estado
    FROM DocumentosEstudiante d
    WHERE d.id_usuario = ?
  `;

  connection.query(query, [alumnoId], (error, results) => {
    if (error) {
      console.error('Error al obtener documentos por alumno:', error);
      return res.status(500).send('Error al obtener documentos por alumno.');
    }

    // Convertir los resultados en un formato más amigable si es necesario
    const documentos = results.map(doc => ({
      id: doc.id,
      tipo: doc.tipo,
      fechaSubida: doc.fecha_subida,
      rutaArchivo: doc.ruta_archivo,
      estado: doc.estado,
    }));

    res.json(documentos);
  });
});


app.get('/api/documentos', (req, res) => {
  const rutaArchivo = req.query.rutaArchivo;

  // Obtén solo el nombre del archivo de la ruta completa para evitar referencias a directorios fuera de 'uploads'
  const nombreArchivo = path.basename(rutaArchivo);

  // Construye la ruta del archivo dentro del directorio 'uploads' para asegurar el acceso solo a este directorio
  const filePath = path.join(__dirname, 'uploads', nombreArchivo);

  // Verifica si el archivo existe antes de intentar enviarlo
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Archivo no encontrado:', err);
      return res.status(404).send('Archivo no encontrado');
    }

    // Envía el archivo al cliente
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error al enviar el archivo:', err);
        if (!res.headersSent) {
          res.status(500).send('Error al enviar el archivo');
        }
      }
    });
  });
});



app.get('/api/especialidades', (req, res) => {
  const query = 'SELECT id_especialidad, nombre_especialidad FROM Especialidades';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener las especialidades:', err);
      return res.status(500).json({ error: 'Error interno del servidor al obtener las especialidades.' });
    }
    res.json({ especialidades: results });
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
    const token = jwt.sign({ id: user.id_usuario, rol: user.rol }, 'tuSuperSecreto', { expiresIn: '1h' });

    res.json({ message: 'Inicio de sesión exitoso', token: token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
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
