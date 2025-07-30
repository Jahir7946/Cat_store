import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://23202001:23202001@cluster0.vgypvgq.mongodb.net/miau_store?retryWrites=true&w=majority&appName=Cluster0';

async function updateAdminUser() {
    try {
        console.log('🔄 Conectando a MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Conectado a MongoDB');

        // Find and update the admin user
        const adminEmail = '23202001@utfv.edu.mx';
        
        console.log(`🔍 Buscando usuario: ${adminEmail}`);
        let user = await User.findOne({ email: adminEmail });
        
        if (user) {
            console.log('👤 Usuario encontrado:', {
                name: user.name,
                email: user.email,
                role: user.role,
                isAdmin: user.isAdmin
            });
            
            // Update user to have admin role
            user.role = 'admin';
            user.isAdmin = true;
            await user.save();
            
            console.log('✅ Usuario actualizado con permisos de administrador');
            console.log('📊 Datos actualizados:', {
                name: user.name,
                email: user.email,
                role: user.role,
                isAdmin: user.isAdmin
            });
        } else {
            console.log('❌ Usuario no encontrado. Creando usuario administrador...');
            
            // Create admin user if doesn't exist
            const newAdmin = new User({
                name: 'Administrador',
                email: adminEmail,
                password: 'qwerty', // This will be hashed by the pre-save middleware
                role: 'admin',
                isAdmin: true
            });
            
            await newAdmin.save();
            console.log('✅ Usuario administrador creado exitosamente');
        }
        
        // Verify all users
        console.log('\n📋 Todos los usuarios en la base de datos:');
        const allUsers = await User.find({});
        allUsers.forEach(user => {
            console.log(`- ${user.name} (${user.email}) - Role: ${user.role || 'user'} - Admin: ${user.isAdmin || false}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Conexión cerrada');
        process.exit(0);
    }
}

updateAdminUser();
