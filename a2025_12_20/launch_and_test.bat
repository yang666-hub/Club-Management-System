@echo off
echo ========================================
echo    启动并测试应用程序
echo ========================================
echo.

echo 1. 检查Java版本...
java -version

echo.
echo 2. 启动应用程序（后台运行）...
start /B java -jar target\a2025_12_20-0.0.1-SNAPSHOT.jar

echo.
echo 3. 等待应用程序启动...
timeout /t 20 /nobreak > nul

echo.
echo 4. 测试API端点...

echo 测试主页:
curl -s -w "状态码: %%{http_code}\n" http://localhost:8081/ || echo 主页测试失败

echo.
echo 测试健康检查:
curl -s -w "状态码: %%{http_code}\n" http://localhost:8081/api/health || echo 健康检查失败

echo.
echo 测试API端点:
curl -s -w "状态码: %%{http_code}\n" http://localhost:8081/api/test || echo API测试失败

echo.
echo 5. 停止应用程序...
taskkill /f /im java.exe > nul 2>&1

echo.
echo ========================================
echo 测试完成！
echo ========================================
pause