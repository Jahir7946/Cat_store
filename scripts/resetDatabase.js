import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Load environment variables
dotenv.config();

// Initial data from your current data.js
const initialProducts = [
    {
        name: "Comida Seca 'Purrfect Meal'",
        price: 29.99,
        category: "alimento",
        image: "cat-food-1.png",
        rating: 5,
        description: "Nutrición completa y balanceada con salmón real para un pelaje brillante.",
        stock: 50
    },
    {
        name: "Bolas de Fieltro (Set de 3)",
        price: 8.50,
        category: "juguetes",
        image: "cat-toy-1.png",
        rating: 4,
        description: "Juguetes seguros y coloridos hechos de lana 100% natural.",
        stock: 100
    },
    {
        name: "Rascador de Madera Moderno",
        price: 75.00,
        category: "accesorios",
        image: "cat-accessory-1.png",
        rating: 5,
        description: "Diseño elegante que se adapta a tu hogar y satisface los instintos de tu gato.",
        stock: 25
    },
    {
        name: "Aditivo Dental 'Fresh Breath'",
        price: 15.99,
        category: "salud",
        image: "cat-health-1.png",
        rating: 4,
        description: "Fácil de usar. Simplemente añádelo al agua para combatir el sarro y el mal aliento.",
        stock: 75
    },
    {
        name: "Lata Húmeda Sabor Atún",
        price: 2.50,
        category: "alimento",
        image: "cat-food-2.png",
        rating: 4,
        description: "Deliciosos trozos de atún en salsa para una comida irresistible.",
        stock: 200
    },
    {
        name: "Varita con Plumas 'Caza Divertida'",
        price: 6.99,
        category: "juguetes",
        image: "cat-toy-2.png",
        rating: 5,
        description: "Estimula el instinto de caza de tu gato con esta divertida varita interactiva.",
        stock: 80
    },
    {
        name: "Cama Nido Acogedora",
        price: 35.00,
        category: "accesorios",
        image: "cat-accessory-2.png",
        rating: 5,
        description: "Una cama suave y cálida para siestas perfectas.",
        stock: 40
    },
    {
        name: "Malta para Control de Bolas de Pelo",
        price: 12.00,
        category: "salud",
        image: "cat-health-2.png",
        rating: 4,
        description: "Ayuda a prevenir la formación de bolas de pelo de forma natural y sabrosa.",
        stock: 60
    }
];

const initialCategories = [
    { id: "all", name: "Todos", description: "Todos los productos disponibles" },
    { id: "alimento", name: "Alimento", description: "Comida y snacks para gatos" },
    { id: "juguetes", name: "Juguetes", description: "Juguetes y entretenimiento" },
    { id: "accesorios", name: "Accesorios", description: "Accesorios y mobiliario para gatos" },
    { id: "salud", name: "Salud", description: "Productos para la salud y bienestar" }
];

async function resetDatabase() {
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

        console.log('🧹 Base de datos limpiada completamente');

        // Wait a moment for the database to process the drops
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Insert categories first
        await Category.insertMany(initialCategories);
        console.log('📂 Categorías insertadas');

        // Insert products
        await Product.insertMany(initialProducts);
        console.log('🛍️ Productos insertados');

        console.log('🎉 Base de datos reinicializada correctamente');
        
        // Show summary
        const productCount = await Product.countDocuments();
        const categoryCount = await Category.countDocuments();
        console.log(`📊 Resumen: ${productCount} productos, ${categoryCount} categorías`);

        // List all products to verify
        const products = await Product.find({}, 'name category price');
        console.log('\n📋 Productos en la base de datos:');
        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - ${product.category} - $${product.price}`);
        });

    } catch (error) {
        console.error('❌ Error reinicializando la base de datos:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Conexión a MongoDB cerrada');
    }
}

// Run the reset function
resetDatabase();
