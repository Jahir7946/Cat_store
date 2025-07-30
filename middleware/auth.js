import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(500).json({ message: 'Error en la autenticación' });
  }
};

// Optional: Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: se requieren permisos de administrador' });
  }
  next();
};
