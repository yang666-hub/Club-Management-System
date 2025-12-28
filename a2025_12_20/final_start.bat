@echo off
echo ========================================
echo    校园社团管理系统 - 最终启动脚本
echo ========================================
echo.

echo 1. 清理并重新构建项目...
call mvnw.cmd clean package -DskipTests

if %ERRORLEVEL% neq 0 (
    echo.
    echo 构建失败！请检查以上错误信息。
    pause
    exit /b 1
)

echo.
echo 2. 检查生成的JAR文件...
if not exist target\a2025_12_20-0.0.1-SNAPSHOT.jar (
    echo JAR文件未找到！
    pause
    exit /b 1
)

echo JAR文件大小:
dir target\a2025_12_20-0.0.1-SNAPSHOT.jar | find "a2025_12_20-0.0.1-SNAPSHOT.jar"

echo.
echo 3. 检查Java版本...
java -version

echo.
echo 4. 启动应用程序...
echo 应用程序将在 http://localhost:8080 启动
echo 按 Ctrl+C 停止应用程序
echo.

java -jar target\a2025_12_20-0.0.1-SNAPSHOT.jar