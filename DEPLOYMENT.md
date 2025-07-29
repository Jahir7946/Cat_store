# Guía de Deployment - Miau Store

## Paso a Paso para Deployment en Render + MongoDB Atlas

### 1. Configurar MongoDB Atlas (Base de Datos)

1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (selecciona la opción gratuita M0)
4. Configura el acceso:
   - Ve a "Database Access" y crea un usuario
   - Ve a "Network Access" y permite acceso desde cualquier IP (0.0.0.0/0)
5. Obtén tu connection string:
   - Ve a "Connect" → "Connect your application"
   - Copia la URL de conexión
   - Reemplaza `<password>` con tu contraseña real

### 2. Preparar el Repositorio

1. Sube tu código a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/miau-store.git
   git push -u origin main
   ```

### 3. Configurar Render

1. Ve a [Render](https://render.com) y crea una cuenta
2. Conecta tu cuenta de GitHub
3. Crea un nuevo "Web Service":
   - Selecciona tu repositorio
   - Configuración:
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

### 4. Variables de Entorno en Render

En la configuración de tu servicio en Render, agrega estas variables:

- `MONGODB_URI`: Tu connection string de MongoDB Atlas
- `NODE_ENV`: `production`
- `JWT_SECRET`: Una cadena secreta aleatoria (puedes generar una en [este sitio](https://generate-secret.vercel.app/32))

### 5. Deploy

1. Render automáticamente detectará los cambios y hará el deploy
2. Tu aplicación estará disponible en: `https://tu-app-name.onrender.com`

### 6. Poblar la Base de Datos (Opcional)

Si quieres agregar datos de prueba:
1. Conéctate a tu aplicación desplegada
2. Ejecuta el script de seed (si está configurado)

## URLs Importantes

- **Aplicación**: https://tu-app-name.onrender.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Render Dashboard**: https://dashboard.render.com

## Notas Importantes

- El plan gratuito de Render se "duerme" después de 15 minutos de inactividad
- MongoDB Atlas ofrece 512MB gratis
- Los primeros accesos después del "sueño" pueden tardar 30-60 segundos

## Solución de Problemas

- **Error de conexión a MongoDB**: Verifica que la IP esté permitida en Network Access
- **Variables de entorno**: Asegúrate de que todas las variables estén configuradas en Render
- **Logs**: Revisa los logs en el dashboard de Render para errores específicos
