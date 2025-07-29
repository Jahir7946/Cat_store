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

1. Tu código ya está en GitHub:
   ```
   Repositorio: https://github.com/Jahir7946/Cat_store
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

**Nota**: Las variables de entorno también están configuradas en `render.yaml`, pero puedes sobrescribirlas en el dashboard de Render si es necesario.

#### Formato correcto del MONGODB_URI:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database_name?retryWrites=true&w=majority&appName=Cluster0
```

**Importante**: 
- Reemplaza `username` y `password` con tus credenciales reales
- Reemplaza `cluster0.xxxxx.mongodb.net` con tu cluster real
- Reemplaza `database_name` con el nombre de tu base de datos (ej: `miau_store`)
- NO uses caracteres especiales como `<>` en la contraseña

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

### Error de Autenticación MongoDB (Error 8000)
Si ves el error "bad auth : authentication failed":

1. **Verifica las credenciales**:
   - Usuario y contraseña correctos en MongoDB Atlas
   - NO uses caracteres especiales como `<>` en la contraseña
   - La contraseña debe estar sin comillas ni caracteres de escape

2. **Verifica la configuración del usuario**:
   - Ve a "Database Access" en MongoDB Atlas
   - Asegúrate de que el usuario tenga permisos de "Read and write to any database"
   - O específicamente permisos en la base de datos `miau_store`

3. **Verifica el formato de la URI**:
   ```
   ✅ Correcto: mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/miau_store
   ❌ Incorrecto: mongodb+srv://usuario:<contraseña>@cluster0.xxxxx.mongodb.net/miau_store
   ```

### Otros Problemas Comunes

- **Error de conexión a MongoDB**: Verifica que la IP esté permitida en Network Access (usa 0.0.0.0/0 para permitir todas)
- **Variables de entorno**: Asegúrate de que todas las variables estén configuradas en Render
- **Logs**: Revisa los logs en el dashboard de Render para errores específicos
- **Timeout de conexión**: El servidor ahora reintenta la conexión automáticamente cada 5 segundos

### Verificar la Conexión

Los logs del servidor ahora proporcionan información más detallada:
- ✅ Conexión exitosa: "Conectado exitosamente a MongoDB Atlas"
- ❌ Error de autenticación: Verifica credenciales y permisos
- ❌ Error de red: Verifica la URI y conexión a internet
- ❌ Error de IP: Agrega 0.0.0.0/0 en Network Access
