const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;
const cors = require('cors');

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
