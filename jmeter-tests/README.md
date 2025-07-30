# Apache JMeter Tests para Miau Store

Este directorio contiene pruebas completas de Apache JMeter para la aplicación Miau Store, incluyendo pruebas de carga, estrés y funcionalidad de endpoints autenticados.

## 📋 Contenido

### Planes de Prueba JMeter

1. **MiauStore_Complete_LoadTest.jmx** - Prueba de carga completa
   - Pruebas de endpoints de productos y categorías
   - 10 usuarios concurrentes, 5 iteraciones
   - Duración: ~2-3 minutos

2. **MiauStore_StressTest.jmx** - Prueba de estrés
   - Alta carga con 100 usuarios concurrentes
   - 20 iteraciones por usuario
   - Duración: 5 minutos
   - Incluye aserciones de tiempo de respuesta

3. **MiauStore_AuthenticatedTest.jmx** - Pruebas de endpoints autenticados
   - Registro y login de usuarios
   - Operaciones con JWT tokens
   - Gestión de perfiles y pedidos
   - Ejecución secuencial para mantener estado

### Scripts de Soporte

- **run-tests.bat** - Script para ejecutar todas las pruebas (Windows)
- **run-tests.sh** - Script para ejecutar todas las pruebas (Linux/Mac)
- **install-jmeter.md** - Guía de instalación de JMeter

## 🚀 Requisitos Previos

### 1. Java
JMeter requiere Java 8 o superior:
```bash
java -version
```

### 2. Apache JMeter
Descargar desde: https://jmeter.apache.org/download_jmeter.cgi

### 3. Servidor Miau Store
El servidor debe estar ejecutándose en `http://localhost:3000`:
```bash
npm start
```

## 📊 Endpoints Probados

### Endpoints Públicos
- `GET /api/products` - Obtener productos (con paginación y búsqueda)
- `GET /api/products/:id` - Obtener producto específico
- `GET /api/categories` - Obtener categorías
- `GET /api/categories/:id` - Obtener categoría específica

### Endpoints Autenticados
- `POST /api/users/register` - Registro de usuario
- `POST /api/users/login` - Login de usuario
- `GET /api/users/profile` - Obtener perfil de usuario
- `PUT /api/users/profile` - Actualizar perfil
- `PUT /api/users/password` - Cambiar contraseña
- `GET /api/orders` - Obtener pedidos del usuario
- `POST /api/orders` - Crear nuevo pedido
- `GET /api/orders/:id` - Obtener pedido específico

### Endpoints de Administrador
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api/orders/admin/all` - Obtener todos los pedidos

## 🔧 Configuración

### Variables de Entorno
Los planes de prueba utilizan las siguientes variables:

- `BASE_URL`: http://localhost:3000 (por defecto)
- `API_BASE`: ${BASE_URL}/api
- `TEST_USER_EMAIL`: Email generado aleatoriamente
- `TEST_USER_PASSWORD`: testpassword123
- `TEST_USER_NAME`: Nombre generado aleatoriamente

### Personalización
Para cambiar la configuración, edita las variables en cada plan de prueba:
1. Abre el archivo .jmx en JMeter GUI
2. Ve a "Test Plan" > "User Defined Variables"
3. Modifica los valores según necesites

## 🏃‍♂️ Ejecución de Pruebas

### Modo GUI (Desarrollo)
```bash
# Abrir JMeter GUI
jmeter

# Cargar un plan de prueba
# File > Open > Seleccionar archivo .jmx
# Hacer clic en el botón "Start" (triángulo verde)
```

### Modo Línea de Comandos (Producción)
```bash
# Prueba de carga completa
jmeter -n -t MiauStore_Complete_LoadTest.jmx -l results/load-test-results.jtl -e -o results/load-test-report

# Prueba de estrés
jmeter -n -t MiauStore_StressTest.jmx -l results/stress-test-results.jtl -e -o results/stress-test-report

# Pruebas autenticadas
jmeter -n -t MiauStore_AuthenticatedTest.jmx -l results/auth-test-results.jtl -e -o results/auth-test-report
```

### Usando Scripts de Automatización
```bash
# Windows
run-tests.bat

# Linux/Mac
chmod +x run-tests.sh
./run-tests.sh
```

## 📈 Interpretación de Resultados

### Métricas Clave
- **Response Time**: Tiempo de respuesta promedio (objetivo: < 2000ms)
- **Throughput**: Transacciones por segundo
- **Error Rate**: Porcentaje de errores (objetivo: < 1%)
- **90th Percentile**: 90% de las respuestas están por debajo de este tiempo

### Listeners Incluidos
- **View Results Tree**: Detalles de cada request/response
- **Summary Report**: Resumen estadístico
- **Aggregate Report**: Métricas detalladas
- **Graph Results**: Gráficos de rendimiento

### Archivos de Resultados
Los resultados se guardan en:
- `jmeter-results/detailed-results.jtl`
- `jmeter-results/summary-report.jtl`
- `jmeter-results/stress-test-results.jtl`
- `jmeter-results/authenticated-test-results.jtl`

## 🎯 Escenarios de Prueba

### 1. Prueba de Carga (Load Test)
**Objetivo**: Verificar el comportamiento bajo carga normal
- **Usuarios**: 10 concurrentes
- **Duración**: 2-3 minutos
- **Escenarios**:
  - Navegación de productos
  - Búsqueda de productos
  - Consulta de categorías

### 2. Prueba de Estrés (Stress Test)
**Objetivo**: Encontrar el punto de quiebre del sistema
- **Usuarios**: 100 concurrentes
- **Duración**: 5 minutos
- **Escenarios**:
  - Carga alta en endpoints principales
  - Variación aleatoria de parámetros
  - Aserciones de tiempo de respuesta

### 3. Pruebas Funcionales Autenticadas
**Objetivo**: Verificar flujos de usuario completos
- **Usuarios**: 5 concurrentes
- **Escenarios**:
  - Registro de usuario
  - Login y obtención de token JWT
  - Operaciones de perfil
  - Gestión de pedidos

## 🔍 Monitoreo y Debugging

### Logs del Servidor
Monitorea los logs del servidor durante las pruebas:
```bash
# En otra terminal
npm start
# Observa los logs de conexión y errores
```

### Verificación de Base de Datos
Verifica el estado de MongoDB durante las pruebas:
```bash
# Conectar a MongoDB
mongosh "mongodb+srv://23202001:23202001@cluster0.vgypvgq.mongodb.net/miau_store"

# Verificar colecciones
show collections
db.users.countDocuments()
db.products.countDocuments()
```

### Debugging de Requests
Para debugging detallado:
1. Habilita "View Results Tree" listener
2. Ejecuta con pocos usuarios (1-2)
3. Revisa request/response data
4. Verifica headers y status codes

## 📋 Checklist Pre-Ejecución

- [ ] Servidor Miau Store ejecutándose en puerto 3000
- [ ] MongoDB conectado y accesible
- [ ] JMeter instalado y configurado
- [ ] Java 8+ disponible
- [ ] Directorio `jmeter-results/` creado
- [ ] Variables de entorno configuradas si es necesario

## 🚨 Troubleshooting

### Error: "Connection refused"
- Verificar que el servidor esté ejecutándose
- Comprobar el puerto (3000 por defecto)
- Verificar firewall/antivirus

### Error: "Authentication failed"
- Verificar credenciales de MongoDB
- Comprobar conexión a internet
- Revisar configuración de MongoDB Atlas

### Error: "High response times"
- Verificar recursos del sistema (CPU, RAM)
- Comprobar conexión de red
- Revisar logs del servidor para errores

### Error: "JWT token invalid"
- Verificar que JWT_SECRET esté configurado
- Comprobar formato del token
- Revisar expiración del token (24h por defecto)

## 📚 Recursos Adicionales

- [Documentación oficial de JMeter](https://jmeter.apache.org/usermanual/index.html)
- [Best Practices para JMeter](https://jmeter.apache.org/usermanual/best-practices.html)
- [Guía de Performance Testing](https://jmeter.apache.org/usermanual/jmeter_distributed_testing_step_by_step.html)

## 🤝 Contribución

Para agregar nuevas pruebas:
1. Crea un nuevo archivo .jmx
2. Documenta los escenarios de prueba
3. Actualiza este README
4. Incluye aserciones apropiadas
5. Prueba en entorno local antes de commit
