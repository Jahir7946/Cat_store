import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/users/register - Register new user
router.post('/register', async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Create new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.email === '23202001@utfv.edu.mx' ? 'admin' : 'user'
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (excluding password) and token
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      user: userData,
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ message: 'Error al registrar usuario', error: error.message });
  }
});

// POST /api/users/login - Login user
router.post('/login', async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(req.body.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (excluding password) and token
    const userData = user.toObject();
    delete userData.password;

    res.json({
      user: userData,
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// GET /api/users/profile - Get user profile (authenticated)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate('orders');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
});

// PUT /api/users/profile - Update user profile (authenticated)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password; // Password updates should be handled separately

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({ message: 'Error al actualizar perfil', error: error.message });
  }
});

// PUT /api/users/password - Update password (authenticated)
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verify current password
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Contraseña actual incorrecta' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(400).json({ message: 'Error al actualizar contraseña', error: error.message });
  }
});

export default router;
