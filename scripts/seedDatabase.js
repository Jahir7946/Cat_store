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

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB Atlas');

        // Clear existing data
        await Product.deleteMany({});
        await Category.deleteMany({});
        console.log('🧹 Datos existentes eliminados');

        // Insert categories
        await Category.insertMany(initialCategories);
        console.log('📂 Categorías insertadas');

        // Insert products
        await Product.insertMany(initialProducts);
        console.log('🛍️ Productos insertados');

        console.log('🎉 Base de datos inicializada correctamente');
        
        // Show summary
        const productCount = await Product.countDocuments();
        const categoryCount = await Category.countDocuments();
        console.log(`📊 Resumen: ${productCount} productos, ${categoryCount} categorías`);

    } catch (error) {
        console.error('❌ Error inicializando la base de datos:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Conexión a MongoDB cerrada');
    }
}

// Run the seeding function
seedDatabase();
