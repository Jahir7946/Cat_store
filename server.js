import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// MongoDB connection with improved error handling
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/miau_store';

console.log('🔄 Intentando conectar a MongoDB...');
console.log('📍 URI de conexión:', mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Hide credentials in logs

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
    });
    console.log('✅ Conectado exitosamente a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    
    // Provide specific error guidance
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Error de autenticación: Verifica las credenciales de MongoDB Atlas');
      console.error('   - Usuario y contraseña correctos');
      console.error('   - Base de datos especificada en la URI');
      console.error('   - Permisos del usuario en la base de datos');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 Error de red: No se puede resolver el hostname de MongoDB Atlas');
      console.error('   - Verifica la conexión a internet');
      console.error('   - Verifica que la URI de MongoDB sea correcta');
    } else if (error.message.includes('IP not in whitelist')) {
      console.error('🚫 Error de IP: La IP no está en la lista blanca de MongoDB Atlas');
      console.error('   - Agrega 0.0.0.0/0 en Network Access de MongoDB Atlas');
    }
    
    console.error('🔄 Reintentando conexión en 5 segundos...');
    setTimeout(connectToMongoDB, 5000);
  }
};

// Initial connection attempt
connectToMongoDB();

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose desconectado de MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('👋 Conexión a MongoDB cerrada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cerrando conexión a MongoDB:', error);
    process.exit(1);
  }
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Serve static files and main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal en el servidor' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
