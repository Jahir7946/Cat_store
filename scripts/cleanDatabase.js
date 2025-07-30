import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Load environment variables
dotenv.config();

async function cleanDatabase() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://23202001:23202001@cluster0.vgypvgq.mongodb.net/catstore?retryWrites=true&w=majority&appName=Cluster0';
        await mongoose.connect(mongoUri);
        console.log('✅ Conectado a MongoDB Atlas');

        // Drop the entire products collection to remove all indexes
        try {
            await mongoose.connection.db.collection('products').drop();
            console.log('🗑️ Colección products eliminada completamente');
        } catch (error) {
            if (error.message.includes('ns not found')) {
                console.log('ℹ️ La colección products no existía');
            } else {
                console.log('⚠️ Error eliminando colección products:', error.message);
            }
        }

        // Drop the categories collection as well
        try {
            await mongoose.connection.db.collection('categories').drop();
            console.log('🗑️ Colección categories eliminada completamente');
        } catch (error) {
            if (error.message.includes('ns not found')) {
                console.log('ℹ️ La colección categories no existía');
            } else {
                console.log('⚠️ Error eliminando colección categories:', error.message);
            }
        }

        // Drop the users collection to remove problematic username index
        try {
            await mongoose.connection.db.collection('users').drop();
            console.log('🗑️ Colección users eliminada completamente');
        } catch (error) {
            if (error.message.includes('ns not found')) {
                console.log('ℹ️ La colección users no existía');
            } else {
                console.log('⚠️ Error eliminando colección users:', error.message);
            }
        }

        console.log('🧹 Base de datos limpiada completamente');

    } catch (error) {
        console.error('❌ Error limpiando la base de datos:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Conexión a MongoDB cerrada');
    }
}

// Run the cleaning function
cleanDatabase();
