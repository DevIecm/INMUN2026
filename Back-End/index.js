require('dotenv').config();
const https = require('https');
const fs = require('fs');

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Crear el servidor
const app = express();

// Habilitar cors
app.use(cors({
    origin: '*'
}));

// Lectura y parseo del body para poder enviar respuesta tipo JSON
app.use(express.json());

// Llamado BD
try {

    dbConnection.authenticate();
    console.log('¡DB online!');

} catch (error) {
    console.log('Error al levanar bd: ', error);
}

/* app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
}) */

/**
 * COMIENZAN RUTAS
 */

// Prueba
app.use('/api/test', require('./routes/test.routes'));

// Usuarios
app.use('/api/usuarios', require('./routes/usuarios.routes'));

// Login
app.use('/api/login', require('./routes/auth.routes'));

// Código QR
app.use('/api/code-qr', require('./routes/qr.routes'));

/**     ADMINISTRACIÓN      **/

app.use('/api/admin-login', require('./routes/admin-auth.routes'));

app.use('/api/admin', require('./routes/admin.routes'));

app.use('/api/comite', require('./routes/comite.routes'));

/**     ADMINISTRACIÓN      **/

/** CATÁLOGOS **/

// Alcaldías
app.use('/api/alcaldias', require('./routes/alcaldias.routes'));

// Estados de la república
app.use('/api/estados-republica', require('./routes/estados-republica-mexicana.routes'));

// Reportes
app.use('/api/admin-reportes', require('./routes/reportes.routes'));

// Generación y envío de constancias
app.use('/api/constancias', require('./routes/constancias.routes'));

// Sistema - Apertura

app.use('/api/estado-sistema', require('./routes/system.routes'));

// Lanzamiento del servicio
// app.listen(process.env.PORT, '192.168.1.121', () => {
app.listen(process.env.PORT, () => {
    console.log(`Server corriendo en el puerto ${process.env.PORT}`);
});

// https.createServer({
//     cert: fs.readFileSync('credentials/server.crt'),
//     key: fs.readFileSync('credentials/server.key')
// }, app).listen(process.env.PORT, () => {
//     console.log('Server corriendo en el puerto ' + process.env.PORT);
// });