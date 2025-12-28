# 社团管理系统详细介绍

这是一个功能完整的校园社团管理平台，采用现代化的前后端分离架构开发。

## 技术架构

| 层级 | 技术选型 |
|------|----------|
| **后端** | Spring Boot 3.2.12 - 企业级Java框架 |
| **ORM** | MyBatis-Plus - 简化数据库操作 |
| **前端** | Vue.js 2.6.14 - 渐进式JavaScript框架 |
| **UI组件** | Element Plus 2.15.14 - 饿了么UI组件库 |
| **数据库** | MySQL - 关系型数据库 |
| **认证** | JWT (JSON Web Token) - 无状态认证 |
| **HTTP客户端** | Axios - HTTP请求库 |
| **项目管理** | Maven - 项目构建管理 |

## 系统功能模块

系统根据用户角色划分为三大功能模块：

### 1. 用户功能（所有登录用户）
- **个人信息** - 查看和修改个人资料
- **社团浏览** - 浏览所有可加入的社团
- **活动浏览** - 查看和报名参加活动
- **我的申请** - 跟踪加入社团/活动的申请状态
- **我的费用** - 查看个人缴费记录

### 2. 社团管理（社长及以上权限）
- **社团信息** - 编辑社团基本信息和介绍
- **成员管理** - 查看和管理社团成员
- **申请处理** - 审核新成员加入申请
- **社团活动** - 发布和管理社团活动
- **通知管理** - 发布社团公告通知
- **费用管理** - 收取和管理社团费用

### 3. 系统管理（管理员专属）
- **用户管理** - 管理系统所有用户账户
- **社团类型管理** - 管理社团分类
- **社团管理** - 审核和管理所有社团
- **成员管理** - 查看所有社团的成员
- **活动管理** - 管理系统所有活动
- **通知管理** - 发布系统级公告
- **申请管理** - 处理所有申请
- **费用管理** - 监管所有费用记录

## 数据库设计

系统包含以下核心数据表：

- `user` - 用户账户信息（用户名、密码、角色、状态等）
- `club` - 社团信息（名称、类型、简介、社长等）
- `activity` - 活动信息（标题、时间、地点、内容等）
- `club_type` - 社团类型分类
- `member` - 社团成员关系（用户与社团的关联）
- `apply` - 申请记录（用户申请加入社团/活动）
- `notice` - 通知公告（系统公告和社团通知）
- `fee` - 费用记录（社团费用缴纳信息）

## 用户角色权限

| 角色 | 等级 | 权限说明 |
|------|------|----------|
| **普通社员** | 1 | 仅能访问用户功能模块 |
| **社长** | 2 | 可访问用户功能 + 社团管理模块 |
| **系统管理员** | 3 | 完整访问所有功能模块 |

## 项目文件结构

```
社团管理end/
├── a2025_12_20/                          # Spring Boot 后端项目
│   ├── pom.xml                           # Maven配置
│   └── src/main/
│       ├── java/com/wordcount/a2025_12_20/
│       │   ├── entity/                   # 实体类（User、Club等）
│       │   ├── mapper/                   # 数据访问层
│       │   ├── service/                  # 业务逻辑层
│       │   └── controller/               # REST API控制器
│       └── resources/
│           ├── application.yml           # 应用配置
│           ├── database.sql              # 数据库脚本
│           └── static/                   # 前端静态资源
│               ├── index.html            # 主页面
│               ├── css/style.css         # 样式文件
│               ├── images/               # 图片资源
│               └── js/                   # JavaScript组件
│                   ├── app.js            # 应用入口
│                   ├── utils/            # 工具函数（API、认证）
│                   └── components/       # 各功能组件
│                       ├── UserManagement.js
│                       ├── ClubList.js
│                       ├── ActivityList.js
│                       └── ...            # 其他功能组件
└── Day1_~Day7_*.md                       # 7天开发计划文档
```

## 系统特点

1. **前后端分离** - 前后端解耦，便于独立开发和部署
2. **角色权限控制** - 基于RBAC模型的细粒度权限管理
3. **响应式设计** - 适配不同屏幕尺寸
4. **现代化UI** - Element Plus提供美观一致的界面
5. **安全认证** - JWT Token实现无状态安全认证
6. **模块化设计** - 各功能模块独立，便于维护和扩展

这是一个典型的校园管理系统原型，涵盖了社团运营的核心业务场景。
<img width="2550" height="1457" alt="image" src="https://github.com/user-attachments/assets/f76da3cb-66a5-4c43-8d7c-20a2b4ca4b4b" />
管理员
<img width="2469" height="1406" alt="image" src="https://github.com/user-attachments/assets/f8b75fae-3e52-4039-b269-ede075f7c493" />
<img width="2492" height="1140" alt="image" src="https://github.com/user-attachments/assets/edb62a13-0c77-400b-beb6-6749c98216fc" />
<img width="2192" height="1203" alt="image" src="https://github.com/user-attachments/assets/0793dbbe-b9f2-4f8c-a054-151431797040" />
<img width="2185" height="817" alt="image" src="https://github.com/user-attachments/assets/1fceebc7-b3fd-4d99-9b1b-308a7f3dbe7d" />
<img width="2193" height="824" alt="image" src="https://github.com/user-attachments/assets/15526f88-f8db-4efb-b3e7-a32fe844f333" />
用户
<img width="2200" height="656" alt="image" src="https://github.com/user-attachments/assets/a6e99a3d-f6c3-4fe0-b41f-2f6489c0277b" />
<img width="2083" height="598" alt="image" src="https://github.com/user-attachments/assets/48f4a895-add1-4fbb-bde8-1dea4d6998d7" />
<img width="2172" height="353" alt="image" src="https://github.com/user-attachments/assets/9636ba96-9a9b-45f1-bbb1-d6099758e32a" />
<img width="2221" height="578" alt="image" src="https://github.com/user-attachments/assets/040fbbf6-531c-4ca4-8228-b26e587c85bb" />
<img width="1916" height="730" alt="image" src="https://github.com/user-attachments/assets/2af7edf9-8e28-478e-b9ec-2b41385d56b9" />


