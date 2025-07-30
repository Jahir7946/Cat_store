import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
      }
      
      try {
        // Get full user data from database
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        req.user = user;
        next();
      } catch (dbError) {
        console.error('Error fetching user from database:', dbError);
        return res.status(500).json({ message: 'Error al obtener datos del usuario' });
      }
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
