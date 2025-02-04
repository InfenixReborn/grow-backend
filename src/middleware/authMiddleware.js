const jwt = require('jsonwebtoken');

const autenticarToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Obtener el token del header Authorization

  if (!token) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Guardar los datos del usuario decodificado en el request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = autenticarToken;