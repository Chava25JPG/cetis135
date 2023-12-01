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
    database: 'EscuelaCETIS135'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});
// Configura CORS para permitir solicitudes del servidor de desarrollo de React
app.use(cors({
    origin: 'http://localhost:3000', // or "*"
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Sirve los archivos estáticos de la aplicación React
app.use(express.static(path.join(__dirname, 'client/build')));

// Rutas
app.get('/api/conocenos', (req, res) => {
    res.json({ message: "¡Bienvenidos a Conócenos!" });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
