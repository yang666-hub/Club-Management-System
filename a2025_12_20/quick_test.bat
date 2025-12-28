@echo off
echo ========================================
echo    Quick Application Test
echo ========================================
echo.

echo Testing basic Java functionality...
java -version

echo.
echo Testing JAR file...
if exist target\a2025_12_20-0.0.1-SNAPSHOT.jar (
    echo JAR file found
) else (
    echo JAR file not found - building now...
    call mvnw.cmd package -DskipTests
)

echo.
echo Starting application for 10 seconds...
start /B java -jar target\a2025_12_20-0.0.1-SNAPSHOT.jar
timeout /t 10 /nobreak > nul

echo.
echo Testing API endpoints...
curl -s http://localhost:8081/api/health || echo Health check failed
curl -s http://localhost:8081/api/test || echo API test failed

echo.
echo Stopping application...
taskkill /f /im java.exe > nul 2>&1

echo.
echo Test completed!
pause