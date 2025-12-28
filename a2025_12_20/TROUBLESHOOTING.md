# 故障排查指南

## 常见问题及解决方案

### 1. 应用程序无法启动

**问题**: 运行 `run.bat` 时应用程序无法启动或立即退出

**可能原因及解决方案**:

#### a) 数据库连接问题
```bash
# 测试数据库连接
test_db.bat

# 检查数据库配置
cat src/main/resources/application.properties
```

**解决方案**:
1. 确保MySQL服务正在运行
2. 检查数据库名称、用户名、密码是否正确
3. 运行 `setup_database.bat` 创建数据库

#### b) 端口冲突
**错误信息**: `Port 8081 is already in use`

**解决方案**:
```bash
# 查找占用端口的进程
netstat -ano | findstr :8081

# 终止占用端口的进程
taskkill /PID <进程ID> /F

# 或使用其他端口启动
java -jar target/a2025_12_20-0.0.1-SNAPSHOT.jar --server.port=8082
```

#### c) Java版本问题
**错误信息**: `Unsupported class file major version`

**解决方案**:
1. 检查Java版本: `java -version`
2. 确保使用JDK 22或更高版本
3. 如果版本不匹配，请升级JDK

#### d) 依赖问题
**错误信息**: `NoSuchMethodError`, `ClassNotFoundException`

**解决方案**:
```bash
# 清理并重新构建项目
mvnw.cmd clean package -DskipTests
```

### 2. API请求失败

**问题**: 前端无法调用后端API

**解决方案**:
1. 检查后端服务是否正常启动
2. 测试健康检查端点: http://localhost:8081/api/health
3. 检查CORS配置
4. 查看浏览器开发者工具中的网络请求

### 3. 数据库相关错误

**问题**: 数据库连接失败或表不存在

**解决方案**:
1. 确保数据库已创建: `mysql -u root -p -e "SHOW DATABASES;"`
2. 检查表是否已创建: `mysql -u root -p -e "USE campus_club_db; SHOW TABLES;"`
3. 重新运行数据库脚本: `setup_database.bat`

### 4. 编译错误

**问题**: `mvn compile` 失败

**解决方案**:
1. 检查pom.xml配置
2. 清理Maven缓存: `mvnw.cmd dependency:purge-local-repository`
3. 重新编译: `mvnw.cmd clean compile`

### 5. 内存不足

**问题**: `OutOfMemoryError`

**解决方案**:
```bash
# 增加JVM内存
java -Xmx2g -Xms1g -jar target/a2025_12_20-0.0.1-SNAPSHOT.jar
```

## 调试技巧

### 1. 启用详细日志
```bash
java -Dlogging.level.root=DEBUG -jar target/a2025_12_20-0.0.1-SNAPSHOT.jar
```

### 2. 检查应用状态
```bash
# 检查健康状态
curl http://localhost:8081/api/health

# 检查API状态
curl http://localhost:8081/api/test
```

### 3. 查看应用日志
应用启动时的日志会显示重要信息，包括:
- 数据库连接状态
- 端口绑定情况
- 组件初始化状态
- 错误信息

## 联系支持

如果以上解决方案都无法解决您的问题，请提供以下信息:
1. 完整的错误信息
2. 操作系统和Java版本
3. 数据库版本
4. 执行的具体步骤

## 预防措施

1. 定期备份数据库
2. 定期清理Maven缓存
3. 保持依赖版本更新
4. 定期检查系统日志