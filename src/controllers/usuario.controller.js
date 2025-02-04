const prisma = require('../db/prisma');
const bcrypt = require('bcrypt'); // Para verificar la contraseña
const jwt = require('jsonwebtoken');

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

// Crear un nuevo usuario
const createUsuario = async (req, res) => {
    const { usuario, correo, nombre, apell_paterno, apell_materno, contrasena, tipo_usuario } = req.body;

    try {
        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(contrasena, 10); // 10 es el número de rondas de hashing

        const nuevoUsuario = await prisma.usuario.create({
            data: {
                usuario,
                correo,
                nombre,
                apell_paterno,
                apell_materno,
                contrasena: hashedPassword, // Guardamos la contraseña encriptada
                tipo_usuario,
            },
        });

        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

const deleteUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const usuarioEliminado = await prisma.usuario.delete({
            where: { id: Number(id) },
        });

        res.status(200).json({ message: "Usuario eliminado correctamente", usuario: usuarioEliminado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el usuario" });
    }
};
const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { usuario, correo, nombre, apell_paterno, apell_materno, contrasena, tipo_usuario } = req.body;
 
    try {
        let updateData = { usuario, correo, nombre, apell_paterno, apell_materno, tipo_usuario };

        // Si se envía una nueva contraseña, encriptarla antes de actualizar
        if (contrasena) {
            updateData.contrasena = await bcrypt.hash(contrasena, 10);
        }

        const usuarioActualizado = await prisma.usuario.update({
            where: { id: Number(id) },
            data: updateData,
        });

        res.status(200).json({ message: "Usuario actualizado correctamente", usuario: usuarioActualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el usuario" });
    }
};
const updateUsuarioModelo2 = async (req, res) => {
    const { id } = req.params;
    const { usuario, tipo_usuario } = req.body;
 
    try {
        let updateData = { usuario, tipo_usuario};

        const usuarioActualizado = await prisma.usuario.update({
            where: { id: Number(id) },
            data: updateData,
        });

        res.status(200).json({ message: "Usuario actualizado correctamente", usuario: usuarioActualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el usuario" });
    }
};
const login = async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
        // Buscar al usuario en la base de datos
        const usuarioEncontrado = await prisma.usuario.findUnique({
            where: { correo }
        });

        if (!usuarioEncontrado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const contrasenaValida = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena);
        if (!contrasenaValida) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Crear un token JWT
        const token = jwt.sign(
            { id: usuarioEncontrado.id, usuario: usuarioEncontrado.usuario },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }  // Puedes ajustar el tiempo de expiración
        );

        // Enviar el token al cliente
        res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};
module.exports = {
    getUsuarios,
    createUsuario,
    login,
    deleteUsuario,
    updateUsuario,
    updateUsuarioModelo2
};
