const express = require('express');
const cors = require('cors'); // Importa el middleware CORS
const usuarioRoutes = require('./routes/usuario.routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Parsear JSON
app.use('/api/usuarios', usuarioRoutes); // Rutas para usuarios

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
