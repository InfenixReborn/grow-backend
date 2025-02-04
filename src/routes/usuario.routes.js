const express = require('express');
const { getUsuarios, createUsuario, login, deleteUsuario, updateUsuario, updateUsuarioModelo2 } = require('../controllers/usuario.controller');
const autenticarToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/listarusuarios', getUsuarios);        // Obtener todos los usuarios
router.post('/crearusuario', createUsuario);     // Crear un nuevo usuario
router.post('/login', login);     // Logearse un nuevo usuario
router.delete("/eliminarusuario/:id", deleteUsuario);
router.put("/editarusuario/:id", updateUsuario);
router.put("/editarusuariomodelo2/:id", updateUsuarioModelo2);

module.exports = router;
