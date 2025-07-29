# 🐱 Miau Store - Todo para tu Gato

Una tienda en línea completa dedicada a productos para gatos, construida con Node.js, Express, MongoDB y JavaScript vanilla.

## 🚀 Características

- **Catálogo de Productos**: Comida, juguetes, accesorios y productos de salud para gatos
- **Carrito de Compras**: Funcionalidad completa de e-commerce
- **Autenticación de Usuarios**: Registro, login y gestión de perfiles
- **Búsqueda y Filtros**: Busca productos por categoría
- **Responsive Design**: Optimizado para móviles y desktop
- **Checkout Completo**: Proceso de compra con información de envío y pago

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos personalizados
- **JavaScript (ES6+)** - Lógica del cliente
- **Tailwind CSS** - Framework de CSS

## 📦 Instalación Local

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/Jahir7946/Cat_store.git
   cd Cat_store
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env
   ```
   Edita el archivo `.env` con tus configuraciones:
   ```
   MONGODB_URI=mongodb://localhost:27017/miau_store
   JWT_SECRET=tu_clave_secreta_aqui
   PORT=3000
   ```

4. **Inicia el servidor**
   ```bash
   npm start
   ```

5. **Visita la aplicación**
   Abre tu navegador en `http://localhost:3000`

## 🌐 Deployment

Esta aplicación está configurada para desplegarse fácilmente en **Render** con **MongoDB Atlas**.

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas de deployment.

### Hosting Gratuito Recomendado:
- **Backend**: [Render](https://render.com) (Plan gratuito)
- **Base de Datos**: [MongoDB Atlas](https://www.mongodb.com/atlas) (512MB gratis)

## 📁 Estructura del Proyecto

```
miau-store/
├── models/           # Modelos de MongoDB
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   └── Order.js
├── routes/           # Rutas de la API
│   ├── users.js
│   ├── products.js
│   ├── categories.js
│   └── orders.js
├── middleware/       # Middleware personalizado
│   └── auth.js
├── services/         # Servicios y utilidades
│   └── api.js
├── scripts/          # Scripts de utilidad
│   └── seedDatabase.js
├── *.png            # Imágenes del producto
├── index.html       # Página principal
├── style.css        # Estilos personalizados
├── app.js           # Lógica del frontend
├── server.js        # Servidor Express
└── package.json     # Dependencias y scripts
```

## 🔧 Scripts Disponibles

- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor en desarrollo
- `npm run seed` - Pobla la base de datos con datos de prueba

## 🐛 Solución de Problemas

### Error de Conexión a MongoDB
- Verifica que MongoDB esté ejecutándose localmente
- Revisa la cadena de conexión en `.env`

### Puerto en Uso
- Cambia el puerto en `.env` o mata el proceso que usa el puerto 3000

### Problemas de CORS
- Verifica que el frontend esté sirviendo desde el mismo dominio

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Miau Store Team**

---

⭐ ¡Dale una estrella si este proyecto te ayudó!
