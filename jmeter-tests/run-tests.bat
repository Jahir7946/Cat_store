@echo off
echo ========================================
echo    Miau Store - JMeter Test Suite
echo ========================================
echo.

REM Check if JMeter is installed
jmeter --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: JMeter no esta instalado o no esta en el PATH
    echo Por favor instala Apache JMeter y agregalo al PATH del sistema
    echo Descarga: https://jmeter.apache.org/download_jmeter.cgi
    pause
    exit /b 1
)

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java no esta instalado
    echo JMeter requiere Java 8 o superior
    pause
    exit /b 1
)

REM Create results directory
if not exist "jmeter-results" mkdir jmeter-results
if not exist "reports" mkdir reports

echo Verificando servidor Miau Store...
curl -s http://localhost:3000/api/products >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: El servidor Miau Store no parece estar ejecutandose en localhost:3000
    echo Por favor inicia el servidor con: npm start
    echo.
    set /p continue="¿Continuar de todos modos? (y/N): "
    if /i not "%continue%"=="y" (
        echo Cancelando ejecucion...
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo  Ejecutando Pruebas de JMeter
echo ========================================
echo.

REM Test 1: Load Test
echo [1/3] Ejecutando Prueba de Carga...
echo Usuarios: 10 concurrentes, 5 iteraciones
jmeter -n -t MiauStore_Complete_LoadTest.jmx -l jmeter-results/load-test-results.jtl -e -o reports/load-test-report
if %errorlevel% neq 0 (
    echo ERROR: Fallo en la prueba de carga
) else (
    echo ✓ Prueba de carga completada exitosamente
)
echo.

REM Test 2: Authenticated Test
echo [2/3] Ejecutando Pruebas de Autenticacion...
echo Usuarios: 5 concurrentes, 3 iteraciones
jmeter -n -t MiauStore_AuthenticatedTest.jmx -l jmeter-results/auth-test-results.jtl -e -o reports/auth-test-report
if %errorlevel% neq 0 (
    echo ERROR: Fallo en las pruebas de autenticacion
) else (
    echo ✓ Pruebas de autenticacion completadas exitosamente
)
echo.

REM Test 3: Stress Test (Optional)
set /p runStress="¿Ejecutar prueba de estres? (100 usuarios, 5 min) (y/N): "
if /i "%runStress%"=="y" (
    echo [3/3] Ejecutando Prueba de Estres...
    echo WARNING: Esta prueba puede ser intensiva para el sistema
    echo Usuarios: 100 concurrentes, 20 iteraciones, 5 minutos
    jmeter -n -t MiauStore_StressTest.jmx -l jmeter-results/stress-test-results.jtl -e -o reports/stress-test-report
    if %errorlevel% neq 0 (
        echo ERROR: Fallo en la prueba de estres
    ) else (
        echo ✓ Prueba de estres completada exitosamente
    )
) else (
    echo [3/3] Prueba de estres omitida
)

echo.
echo ========================================
echo  Resumen de Resultados
echo ========================================
echo.

REM Display results summary
if exist "jmeter-results\load-test-results.jtl" (
    echo ✓ Prueba de Carga: Completada
    echo   Reporte: reports\load-test-report\index.html
) else (
    echo ✗ Prueba de Carga: Fallida
)

if exist "jmeter-results\auth-test-results.jtl" (
    echo ✓ Pruebas de Autenticacion: Completadas
    echo   Reporte: reports\auth-test-report\index.html
) else (
    echo ✗ Pruebas de Autenticacion: Fallidas
)

if exist "jmeter-results\stress-test-results.jtl" (
    echo ✓ Prueba de Estres: Completada
    echo   Reporte: reports\stress-test-report\index.html
) else (
    echo - Prueba de Estres: No ejecutada
)

echo.
echo ========================================
echo  Instrucciones Post-Ejecucion
echo ========================================
echo.
echo 1. Revisa los reportes HTML en la carpeta 'reports\'
echo 2. Abre los archivos index.html en tu navegador
echo 3. Analiza las metricas de rendimiento:
echo    - Response Time (objetivo: ^< 2000ms)
echo    - Throughput (transacciones/segundo)
echo    - Error Rate (objetivo: ^< 1%%)
echo.
echo 4. Archivos de resultados detallados en 'jmeter-results\'
echo.

set /p openReports="¿Abrir reportes en el navegador? (y/N): "
if /i "%openReports%"=="y" (
    if exist "reports\load-test-report\index.html" start "" "reports\load-test-report\index.html"
    if exist "reports\auth-test-report\index.html" start "" "reports\auth-test-report\index.html"
    if exist "reports\stress-test-report\index.html" start "" "reports\stress-test-report\index.html"
)

echo.
echo Ejecucion de pruebas completada.
pause
