const products = [
    {
        id: 1,
        name: "Comida Seca 'Purrfect Meal'",
        price: 29.99,
        category: "alimento",
        image: "cat-food-1.png",
        rating: 5,
        description: "Nutrición completa y balanceada con salmón real para un pelaje brillante."
    },
    {
        id: 2,
        name: "Bolas de Fieltro (Set de 3)",
        price: 8.50,
        category: "juguetes",
        image: "cat-toy-1.png",
        rating: 4,
        description: "Juguetes seguros y coloridos hechos de lana 100% natural."
    },
    {
        id: 3,
        name: "Rascador de Madera Moderno",
        price: 75.00,
        category: "accesorios",
        image: "cat-accessory-1.png",
        rating: 5,
        description: "Diseño elegante que se adapta a tu hogar y satisface los instintos de tu gato."
    },
    {
        id: 4,
        name: "Aditivo Dental 'Fresh Breath'",
        price: 15.99,
        category: "salud",
        image: "cat-health-1.png",
        rating: 4,
        description: "Fácil de usar. Simplemente añádelo al agua para combatir el sarro y el mal aliento."
    },
    {
        id: 5,
        name: "Lata Húmeda Sabor Atún",
        price: 2.50,
        category: "alimento",
        image: "cat-food-2.png",
        rating: 4,
        description: "Deliciosos trozos de atún en salsa para una comida irresistible."
    },
    {
        id: 6,
        name: "Varita con Plumas 'Caza Divertida'",
        price: 6.99,
        category: "juguetes",
        image: "cat-toy-2.png",
        rating: 5,
        description: "Estimula el instinto de caza de tu gato con esta divertida varita interactiva."
    },
    {
        id: 7,
        name: "Cama Nido Acogedora",
        price: 35.00,
        category: "accesorios",
        image: "cat-accessory-2.png",
        rating: 5,
        description: "Una cama suave y cálida para siestas perfectas."
    },
    {
        id: 8,
        name: "Malta para Control de Bolas de Pelo",
        price: 12.00,
        category: "salud",
        image: "cat-health-2.png",
        rating: 4,
        description: "Ayuda a prevenir la formación de bolas de pelo de forma natural y sabrosa."
    }
];

const categories = [
    { id: "all", name: "Todos" },
    { id: "alimento", name: "Alimento" },
    { id: "juguetes", name: "Juguetes" },
    { id: "accesorios", name: "Accesorios" },
    { id: "salud", name: "Salud" }
];

export { products, categories };