# 校园社团管理系统

基于SpringBoot和Vue实现的校园社团管理系统，采用前后端分离的架构方式，支持用户、社团管理员和系统管理员三种角色。

## 系统功能

### 用户功能
- 注册/登录
- 社团信息浏览
- 社团活动浏览
- 入团申请记录
- 社团费用记录

### 社团管理员功能
- 社团信息浏览
- 社团成员管理
- 入团申请处理
- 社团活动浏览
- 通知信息管理
- 费用记录管理

### 系统管理员功能
- 系统用户管理
- 社团类型管理
- 社团信息管理
- 社团成员管理
- 社团活动管理
- 通知信息管理
- 入团申请记录
- 费用记录管理

## 技术栈

### 后端
- Spring Boot 3.1.5
- MyBatis-Plus 3.5.3
- MySQL 8.0
- JWT
- Lombok

### 前端
- Vue.js 2.6.14
- Element UI
- Axios

## 环境要求

- JDK 17+ (项目配置使用JDK 17)
- Maven 3.6+
- MySQL 8.0+
- Node.js 14+ (可选，仅用于前端开发)

## 快速开始

### 1. 数据库配置
创建MySQL数据库并执行`database.sql`文件中的SQL语句初始化数据库表结构和初始数据。

```bash
mysql -u root -p < database.sql
```

### 2. 修改数据库连接配置
修改`src/main/resources/application.properties`文件中的数据库连接信息：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campus_club_db?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=your_password
```

### 3. 启动后端服务

**方式一：使用最终启动脚本（推荐）**
```bash
# 自动构建并启动应用
final_start.bat
```

**方式二：使用批处理脚本**
```bash
# 确保数据库已创建后，运行：
run.bat
```

**方式三：使用Maven启动**
```bash
mvn spring-boot:run
```

**方式四：先构建再运行**
```bash
mvn clean package -DskipTests
java -jar target/a2025_12_20-0.0.1-SNAPSHOT.jar
```

后端服务默认运行在8081端口。

### 4. 验证服务启动
```bash
# 测试API端点
test_api.bat

# 完整验证应用功能
verify_app.bat
```

### 5. 访问系统
打开浏览器访问：http://localhost:8081

### 6. 测试API端点
- 健康检查: http://localhost:8081/api/health
- API测试:   http://localhost:8081/api/test

### 5. 默认账号
- 系统管理员账号：admin / 123456
- 社团管理员账号：club_admin1 / 123456
- 普通用户账号：user1 / 123456

## 项目结构

```
d:/a2025_12_20/
├── database.sql                 # 数据库初始化脚本
├── pom.xml                      # Maven配置文件
├── README.md                    # 项目说明文档
├── src/
│   ├── main/
│   │   ├── java/com/wordcount/a2025_12_20/
│   │   │   ├── A20251220Application.java
│   │   │   ├── common/          # 公共类
│   │   │   ├── config/          # 配置类
│   │   │   ├── controller/      # 控制器
│   │   │   ├── dto/             # 数据传输对象
│   │   │   ├── entity/          # 实体类
│   │   │   ├── mapper/          # MyBatis映射接口
│   │   │   ├── service/         # 服务层
│   │   │   └── util/            # 工具类
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/          # 静态资源
│   │           ├── css/
│   │           ├── js/
│   │           │   ├── app.js
│   │           │   ├── components/
│   │           │   └── utils/
│   │           └── index.html
│   └── test/                    # 测试代码
└── target/                      # Maven构建输出目录
```

## 开发说明

### 后端API
所有API接口都遵循RESTful风格，返回统一的JSON格式：

```json
{
    "code": 200,
    "message": "成功",
    "data": {}
}
```

### 前端组件
前端采用Vue.js组件化开发，每个功能模块对应一个独立的Vue组件。

## 注意事项

1. 确保MySQL服务已启动并创建了对应的数据库
2. 修改application.properties中的数据库连接信息
3. 首次运行需要执行database.sql中的SQL脚本
4. 系统默认密码为123456，生产环境请修改默认密码

## 扩展功能

系统支持的功能扩展：
- 文件上传（头像、社团Logo等）
- 活动报名
- 费用统计报表
- 消息通知
- 权限细分

## 许可证

本项目仅供学习和研究使用。