#!/bin/bash

echo "========================================"
echo "    Miau Store - JMeter Test Suite"
echo "========================================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if JMeter is installed
if ! command -v jmeter &> /dev/null; then
    echo -e "${RED}ERROR: JMeter no está instalado o no está en el PATH${NC}"
    echo "Por favor instala Apache JMeter y agrégalo al PATH del sistema"
    echo "Descarga: https://jmeter.apache.org/download_jmeter.cgi"
    echo
    echo "Instalación rápida (macOS con Homebrew):"
    echo "  brew install jmeter"
    echo
    echo "Instalación rápida (Ubuntu/Debian):"
    echo "  sudo apt-get install jmeter"
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo -e "${RED}ERROR: Java no está instalado${NC}"
    echo "JMeter requiere Java 8 o superior"
    exit 1
fi

# Create results directory
mkdir -p jmeter-results
mkdir -p reports

echo "Verificando servidor Miau Store..."
if ! curl -s http://localhost:3000/api/products > /dev/null 2>&1; then
    echo -e "${YELLOW}WARNING: El servidor Miau Store no parece estar ejecutándose en localhost:3000${NC}"
    echo "Por favor inicia el servidor con: npm start"
    echo
    read -p "¿Continuar de todos modos? (y/N): " continue
    if [[ ! $continue =~ ^[Yy]$ ]]; then
        echo "Cancelando ejecución..."
        exit 1
    fi
fi

echo
echo "========================================"
echo "  Ejecutando Pruebas de JMeter"
echo "========================================"
echo

# Test 1: Load Test
echo "[1/3] Ejecutando Prueba de Carga..."
echo "Usuarios: 10 concurrentes, 5 iteraciones"
if jmeter -n -t MiauStore_Complete_LoadTest.jmx -l jmeter-results/load-test-results.jtl -e -o reports/load-test-report; then
    echo -e "${GREEN}✓ Prueba de carga completada exitosamente${NC}"
else
    echo -e "${RED}ERROR: Falló la prueba de carga${NC}"
fi
echo

# Test 2: Authenticated Test
echo "[2/3] Ejecutando Pruebas de Autenticación..."
echo "Usuarios: 5 concurrentes, 3 iteraciones"
if jmeter -n -t MiauStore_AuthenticatedTest.jmx -l jmeter-results/auth-test-results.jtl -e -o reports/auth-test-report; then
    echo -e "${GREEN}✓ Pruebas de autenticación completadas exitosamente${NC}"
else
    echo -e "${RED}ERROR: Fallaron las pruebas de autenticación${NC}"
fi
echo

# Test 3: Stress Test (Optional)
read -p "¿Ejecutar prueba de estrés? (100 usuarios, 5 min) (y/N): " runStress
if [[ $runStress =~ ^[Yy]$ ]]; then
    echo "[3/3] Ejecutando Prueba de Estrés..."
    echo -e "${YELLOW}WARNING: Esta prueba puede ser intensiva para el sistema${NC}"
    echo "Usuarios: 100 concurrentes, 20 iteraciones, 5 minutos"
    if jmeter -n -t MiauStore_StressTest.jmx -l jmeter-results/stress-test-results.jtl -e -o reports/stress-test-report; then
        echo -e "${GREEN}✓ Prueba de estrés completada exitosamente${NC}"
    else
        echo -e "${RED}ERROR: Falló la prueba de estrés${NC}"
    fi
else
    echo "[3/3] Prueba de estrés omitida"
fi

echo
echo "========================================"
echo "  Resumen de Resultados"
echo "========================================"
echo

# Display results summary
if [ -f "jmeter-results/load-test-results.jtl" ]; then
    echo -e "${GREEN}✓ Prueba de Carga: Completada${NC}"
    echo "  Reporte: reports/load-test-report/index.html"
else
    echo -e "${RED}✗ Prueba de Carga: Fallida${NC}"
fi

if [ -f "jmeter-results/auth-test-results.jtl" ]; then
    echo -e "${GREEN}✓ Pruebas de Autenticación: Completadas${NC}"
    echo "  Reporte: reports/auth-test-report/index.html"
else
    echo -e "${RED}✗ Pruebas de Autenticación: Fallidas${NC}"
fi

if [ -f "jmeter-results/stress-test-results.jtl" ]; then
    echo -e "${GREEN}✓ Prueba de Estrés: Completada${NC}"
    echo "  Reporte: reports/stress-test-report/index.html"
else
    echo "- Prueba de Estrés: No ejecutada"
fi

echo
echo "========================================"
echo "  Instrucciones Post-Ejecución"
echo "========================================"
echo
echo "1. Revisa los reportes HTML en la carpeta 'reports/'"
echo "2. Abre los archivos index.html en tu navegador"
echo "3. Analiza las métricas de rendimiento:"
echo "   - Response Time (objetivo: < 2000ms)"
echo "   - Throughput (transacciones/segundo)"
echo "   - Error Rate (objetivo: < 1%)"
echo
echo "4. Archivos de resultados detallados en 'jmeter-results/'"
echo

read -p "¿Abrir reportes en el navegador? (y/N): " openReports
if [[ $openReports =~ ^[Yy]$ ]]; then
    # Try different browsers
    if command -v xdg-open &> /dev/null; then
        # Linux
        [ -f "reports/load-test-report/index.html" ] && xdg-open "reports/load-test-report/index.html"
        [ -f "reports/auth-test-report/index.html" ] && xdg-open "reports/auth-test-report/index.html"
        [ -f "reports/stress-test-report/index.html" ] && xdg-open "reports/stress-test-report/index.html"
    elif command -v open &> /dev/null; then
        # macOS
        [ -f "reports/load-test-report/index.html" ] && open "reports/load-test-report/index.html"
        [ -f "reports/auth-test-report/index.html" ] && open "reports/auth-test-report/index.html"
        [ -f "reports/stress-test-report/index.html" ] && open "reports/stress-test-report/index.html"
    else
        echo "No se pudo abrir automáticamente. Abre manualmente los archivos HTML en tu navegador."
    fi
fi

echo
echo -e "${GREEN}Ejecución de pruebas completada.${NC}"
