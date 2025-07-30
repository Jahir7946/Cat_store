# 📊 Resumen Completo: Pruebas con Apache JMeter para Miau Store

## 🎯 Objetivo Completado

Se han creado pruebas completas con Apache JMeter para la aplicación **Miau Store**, incluyendo todos los endpoints de la API y diferentes escenarios de carga.

## 📁 Archivos Creados

### Planes de Prueba JMeter (.jmx)
1. **`MiauStore_Complete_LoadTest.jmx`** - Prueba de carga general
2. **`MiauStore_StressTest.jmx`** - Prueba de estrés con alta carga
3. **`MiauStore_AuthenticatedTest.jmx`** - Pruebas de endpoints autenticados

### Scripts de Automatización
4. **`run-tests.bat`** - Script de ejecución para Windows
5. **`run-tests.sh`** - Script de ejecución para Linux/macOS

### Documentación
6. **`README.md`** - Documentación completa de las pruebas
7. **`install-jmeter.md`** - Guía de instalación de JMeter
8. **`test-data.csv`** - Datos de prueba para usuarios y búsquedas

## 🔍 Endpoints Probados

### ✅ Endpoints Públicos
- `GET /api/products` - Listar productos (con paginación, filtros, búsqueda)
- `GET /api/products/:id` - Obtener producto específico
- `GET /api/categories` - Listar categorías
- `GET /api/categories/:id` - Obtener categoría específica

### 🔐 Endpoints Autenticados
- `POST /api/users/register` - Registro de usuario
- `POST /api/users/login` - Autenticación de usuario
- `GET /api/users/profile` - Obtener perfil de usuario
- `PUT /api/users/profile` - Actualizar perfil
- `PUT /api/users/password` - Cambiar contraseña
- `GET /api/orders` - Obtener pedidos del usuario
- `POST /api/orders` - Crear nuevo pedido
- `GET /api/orders/:id` - Obtener pedido específico

### 👨‍💼 Endpoints de Administrador
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api/orders/admin/all` - Obtener todos los pedidos

## 📈 Escenarios de Prueba Implementados

### 1. Prueba de Carga (Load Test)
- **Usuarios concurrentes**: 10
- **Iteraciones**: 5 por usuario
- **Duración estimada**: 2-3 minutos
- **Objetivo**: Verificar comportamiento bajo carga normal

### 2. Prueba de Estrés (Stress Test)
- **Usuarios concurrentes**: 100
- **Iteraciones**: 20 por usuario
- **Duración**: 5 minutos
- **Objetivo**: Encontrar el punto de quiebre del sistema

### 3. Pruebas Funcionales Autenticadas
- **Usuarios concurrentes**: 5
- **Iteraciones**: 3 por usuario
- **Flujo completo**: Registro → Login → Operaciones autenticadas
- **Objetivo**: Verificar funcionalidad de JWT y endpoints protegidos

## 🛠️ Características Técnicas Implementadas

### Autenticación JWT
- Extracción automática de tokens JWT
- Reutilización de tokens en requests subsecuentes
- Manejo de headers de autorización

### Validaciones y Aserciones
- Verificación de códigos de respuesta HTTP
- Aserciones de tiempo de respuesta
- Validación de contenido JSON
- Manejo de errores y timeouts

### Configuración Avanzada
- Variables parametrizables (URLs, credenciales)
- Datos de prueba aleatorios
- Timers para simular comportamiento real
- Configuración de timeouts y reintentos

### Reportes y Monitoreo
- Múltiples listeners para diferentes vistas
- Generación automática de reportes HTML
- Exportación de resultados en formato JTL
- Métricas detalladas de rendimiento

## 🚀 Instrucciones de Ejecución

### Prerrequisitos
1. **Java 8+** instalado
2. **Apache JMeter** instalado y en PATH
3. **Servidor Miau Store** ejecutándose en `localhost:3000`
4. **MongoDB** conectado y accesible

### Ejecución Rápida

**Windows:**
```cmd
cd jmeter-tests
run-tests.bat
```

**Linux/macOS:**
```bash
cd jmeter-tests
chmod +x run-tests.sh
./run-tests.sh
```

### Ejecución Manual
```bash
# Prueba de carga
jmeter -n -t MiauStore_Complete_LoadTest.jmx -l results/load-test.jtl -e -o reports/load-test

# Prueba de estrés
jmeter -n -t MiauStore_StressTest.jmx -l results/stress-test.jtl -e -o reports/stress-test

# Pruebas autenticadas
jmeter -n -t MiauStore_AuthenticatedTest.jmx -l results/auth-test.jtl -e -o reports/auth-test
```

## 📊 Métricas de Rendimiento Esperadas

### Objetivos de Rendimiento
- **Tiempo de respuesta promedio**: < 2000ms
- **95th percentile**: < 3000ms
- **Tasa de error**: < 1%
- **Throughput mínimo**: 10 transacciones/segundo

### Endpoints Críticos
- `GET /api/products`: < 1000ms (endpoint más usado)
- `POST /api/users/login`: < 1500ms (autenticación)
- `POST /api/orders`: < 2000ms (transacciones)

## 🔧 Personalización y Extensión

### Modificar Carga de Usuarios
Editar en cada archivo .jmx:
- `ThreadGroup.num_threads` - Número de usuarios
- `LoopController.loops` - Iteraciones por usuario
- `ThreadGroup.ramp_time` - Tiempo de arranque

### Agregar Nuevos Endpoints
1. Abrir JMeter GUI
2. Cargar plan de prueba existente
3. Agregar nuevo HTTP Request Sampler
4. Configurar assertions y extractors
5. Guardar y probar

### Configurar Diferentes Entornos
Modificar variables en "User Defined Variables":
- `BASE_URL` - URL del servidor
- Credenciales de prueba
- Parámetros específicos del entorno

## 📋 Checklist de Validación

### ✅ Funcionalidad
- [ ] Todos los endpoints responden correctamente
- [ ] Autenticación JWT funciona
- [ ] Validaciones de entrada funcionan
- [ ] Manejo de errores es apropiado

### ✅ Rendimiento
- [ ] Tiempos de respuesta dentro de objetivos
- [ ] Sistema estable bajo carga normal
- [ ] Identificado punto de quiebre en estrés
- [ ] Sin memory leaks o degradación

### ✅ Escalabilidad
- [ ] Rendimiento lineal con usuarios concurrentes
- [ ] Base de datos maneja la carga
- [ ] Conexiones de red estables
- [ ] Recursos del servidor suficientes

## 🚨 Problemas Comunes y Soluciones

### Error: "Connection refused"
**Causa**: Servidor no está ejecutándose
**Solución**: `npm start` en el directorio del proyecto

### Error: "Authentication failed"
**Causa**: Problemas con MongoDB o JWT
**Solución**: Verificar conexión a MongoDB y variable JWT_SECRET

### Error: "High response times"
**Causa**: Sobrecarga del sistema o red lenta
**Solución**: Reducir usuarios concurrentes o mejorar recursos

### Error: "OutOfMemoryError"
**Causa**: JMeter sin suficiente memoria
**Solución**: Aumentar heap size en configuración de JMeter

## 📚 Recursos y Referencias

### Documentación Técnica
- [Apache JMeter User Manual](https://jmeter.apache.org/usermanual/index.html)
- [JMeter Best Practices](https://jmeter.apache.org/usermanual/best-practices.html)
- [Performance Testing Guide](https://jmeter.apache.org/usermanual/jmeter_distributed_testing_step_by_step.html)

### Herramientas Complementarias
- **MongoDB Compass** - Monitoreo de base de datos
- **Node.js Performance Hooks** - Profiling del servidor
- **System Monitor** - Recursos del sistema durante pruebas

## 🎉 Conclusión

Se ha implementado una suite completa de pruebas de rendimiento para **Miau Store** que incluye:

✅ **Cobertura completa** de todos los endpoints de la API
✅ **Múltiples escenarios** de carga (normal, estrés, funcional)
✅ **Automatización completa** con scripts de ejecución
✅ **Documentación detallada** para uso y mantenimiento
✅ **Configuración flexible** para diferentes entornos
✅ **Reportes profesionales** con métricas detalladas

Las pruebas están listas para ejecutarse y proporcionarán información valiosa sobre el rendimiento, escalabilidad y estabilidad de la aplicación Miau Store bajo diferentes condiciones de carga.

---

**Autor**: BLACKBOXAI  
**Fecha**: $(date)  
**Versión**: 1.0  
**Proyecto**: Miau Store - Todo para tu gato
