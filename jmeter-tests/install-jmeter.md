# Guía de Instalación de Apache JMeter

Esta guía te ayudará a instalar Apache JMeter en diferentes sistemas operativos para ejecutar las pruebas de carga de Miau Store.

## 📋 Requisitos Previos

### Java
JMeter requiere Java 8 o superior. Verifica tu instalación:

```bash
java -version
```

Si no tienes Java instalado:

**Windows:**
- Descarga desde [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) o [OpenJDK](https://openjdk.org/)
- Instala y configura JAVA_HOME

**macOS:**
```bash
# Con Homebrew
brew install openjdk@11

# Configurar JAVA_HOME
echo 'export JAVA_HOME=$(/usr/libexec/java_home)' >> ~/.zshrc
source ~/.zshrc
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install openjdk-11-jdk

# Configurar JAVA_HOME
echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> ~/.bashrc
source ~/.bashrc
```

## 🚀 Instalación de JMeter

### Método 1: Descarga Manual (Recomendado)

1. **Descargar JMeter**
   - Ve a https://jmeter.apache.org/download_jmeter.cgi
   - Descarga la versión binaria más reciente (apache-jmeter-X.X.tgz o .zip)

2. **Extraer el archivo**
   ```bash
   # Linux/macOS
   tar -xzf apache-jmeter-5.6.2.tgz
   
   # Windows: Usar WinRAR, 7-Zip o extractor integrado
   ```

3. **Configurar PATH**
   
   **Windows:**
   ```cmd
   # Agregar al PATH del sistema
   # Panel de Control > Sistema > Configuración avanzada del sistema > Variables de entorno
   # Agregar: C:\path\to\apache-jmeter-5.6.2\bin
   ```
   
   **Linux/macOS:**
   ```bash
   # Agregar al ~/.bashrc o ~/.zshrc
   export JMETER_HOME=/path/to/apache-jmeter-5.6.2
   export PATH=$PATH:$JMETER_HOME/bin
   
   # Recargar configuración
   source ~/.bashrc  # o ~/.zshrc
   ```

4. **Verificar instalación**
   ```bash
   jmeter --version
   ```

### Método 2: Gestores de Paquetes

**macOS con Homebrew:**
```bash
brew install jmeter
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install jmeter
```

**Windows con Chocolatey:**
```cmd
choco install jmeter
```

**Windows con Scoop:**
```cmd
scoop install jmeter
```

## ⚙️ Configuración Adicional

### Aumentar Memoria Heap (Recomendado)

Para pruebas de carga intensivas, aumenta la memoria disponible:

**Windows (jmeter.bat):**
```cmd
# Editar: JMETER_HOME\bin\jmeter.bat
# Cambiar: set HEAP=-Xms1g -Xmx1g -XX:MaxMetaspaceSize=256m
set HEAP=-Xms2g -Xmx4g -XX:MaxMetaspaceSize=512m
```

**Linux/macOS (jmeter):**
```bash
# Editar: JMETER_HOME/bin/jmeter
# Cambiar: HEAP="-Xms1g -Xmx1g -XX:MaxMetaspaceSize=256m"
HEAP="-Xms2g -Xmx4g -XX:MaxMetaspaceSize=512m"
```

### Configuración de JMeter Properties

Crea/edita `JMETER_HOME/bin/user.properties`:

```properties
# Configuraciones recomendadas para pruebas de carga
jmeter.save.saveservice.output_format=xml
jmeter.save.saveservice.response_data=false
jmeter.save.saveservice.samplerData=false
jmeter.save.saveservice.requestHeaders=false
jmeter.save.saveservice.responseHeaders=false

# Configuración de HTTP
httpclient4.retrycount=1
httpclient4.request.timeout=60000
httpclient4.connect.timeout=60000

# Configuración de SSL (si es necesario)
https.default.protocol=TLS
https.socket.protocols=TLSv1.2,TLSv1.3
```

## 🧪 Verificación de la Instalación

### Prueba Básica
```bash
# Verificar versión
jmeter --version

# Debería mostrar algo como:
# Apache JMeter 5.6.2
# Copyright (c) 1999-2023 The Apache Software Foundation
```

### Prueba GUI
```bash
# Abrir interfaz gráfica
jmeter

# Debería abrir la ventana de JMeter
```

### Prueba de Línea de Comandos
```bash
# Crear un plan de prueba simple
jmeter -n -t test-plan.jmx -l results.jtl

# Si no tienes un plan de prueba, esto debería mostrar un error esperado
```

## 🔧 Solución de Problemas

### Error: "Command not found"
- Verifica que JMeter esté en el PATH
- Reinicia la terminal después de configurar PATH
- En Windows, reinicia el sistema si es necesario

### Error: "Java not found"
- Instala Java 8 o superior
- Configura JAVA_HOME correctamente
- Verifica con `java -version`

### Error: "OutOfMemoryError"
- Aumenta la memoria heap como se describió arriba
- Cierra otras aplicaciones que consuman memoria
- Considera usar modo no-GUI para pruebas grandes

### Error: "Permission denied" (Linux/macOS)
```bash
# Dar permisos de ejecución
chmod +x $JMETER_HOME/bin/jmeter
```

### Problemas de Firewall/Antivirus
- Agrega JMeter a las excepciones del firewall
- Configura el antivirus para no bloquear JMeter
- En entornos corporativos, contacta al administrador de sistemas

## 📚 Recursos Adicionales

### Documentación Oficial
- [Manual de Usuario de JMeter](https://jmeter.apache.org/usermanual/index.html)
- [Mejores Prácticas](https://jmeter.apache.org/usermanual/best-practices.html)
- [FAQ Oficial](https://jmeter.apache.org/usermanual/jmeter_faq.html)

### Plugins Útiles
- [JMeter Plugins Manager](https://jmeter-plugins.org/wiki/PluginsManager/)
- [Custom Thread Groups](https://jmeter-plugins.org/wiki/ConcurrencyThreadGroup/)
- [Server Performance Monitoring](https://jmeter-plugins.org/wiki/PerfMon/)

### Instalación de Plugins
1. Descarga `jmeter-plugins-manager-X.X.jar`
2. Colócalo en `JMETER_HOME/lib/ext/`
3. Reinicia JMeter
4. Ve a Options > Plugins Manager

## ✅ Checklist de Instalación

- [ ] Java 8+ instalado y configurado
- [ ] JMeter descargado e instalado
- [ ] PATH configurado correctamente
- [ ] `jmeter --version` funciona
- [ ] GUI de JMeter se abre correctamente
- [ ] Memoria heap configurada (opcional)
- [ ] Propiedades personalizadas configuradas (opcional)
- [ ] Plugins instalados (opcional)

## 🎯 Próximos Pasos

Una vez que JMeter esté instalado:

1. Ve al directorio `jmeter-tests/` del proyecto Miau Store
2. Lee el archivo `README.md` para instrucciones específicas
3. Ejecuta las pruebas usando los scripts proporcionados:
   - Windows: `run-tests.bat`
   - Linux/macOS: `./run-tests.sh`

¡Ya estás listo para ejecutar las pruebas de carga de Miau Store! 🚀
