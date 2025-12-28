-- 创建数据库
CREATE DATABASE IF NOT EXISTS campus_club_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE campus_club_db;

-- 社团类型表
CREATE TABLE IF NOT EXISTS club_type (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    name VARCHAR(50) NOT NULL COMMENT '类型名称',
    description VARCHAR(200) DEFAULT NULL COMMENT '描述',
    status INT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT '社团类型表';

-- 用户表
CREATE TABLE IF NOT EXISTS user (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    real_name VARCHAR(50) NOT NULL COMMENT '真实姓名',
    sex VARCHAR(10) DEFAULT '男' COMMENT '性别',
    phone VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    email VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    avatar VARCHAR(200) DEFAULT NULL COMMENT '头像URL',
    user_type INT DEFAULT 1 COMMENT '用户类型：1-普通用户，2-社团管理员，3-系统管理员',
    club_id INT DEFAULT NULL COMMENT '社团管理员关联的社团ID',
    status INT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT '用户表';

-- 社团表
CREATE TABLE IF NOT EXISTS club (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    name VARCHAR(100) NOT NULL COMMENT '社团名称',
    description TEXT COMMENT '社团简介',
    club_type_id INT COMMENT '社团类型ID',
    logo VARCHAR(200) DEFAULT NULL COMMENT '社团Logo URL',
    established_time VARCHAR(50) DEFAULT NULL COMMENT '成立时间',
    member_count INT DEFAULT 0 COMMENT '成员数量',
    status INT DEFAULT 0 COMMENT '状态：0-待审核，1-正常，2-解散',
    admin_id INT DEFAULT NULL COMMENT '社团管理员ID',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (club_type_id) REFERENCES club_type(id),
    FOREIGN KEY (admin_id) REFERENCES user(id)
) COMMENT '社团表';

-- 社团成员表
CREATE TABLE IF NOT EXISTS club_member (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    club_id INT NOT NULL COMMENT '社团ID',
    user_id INT NOT NULL COMMENT '用户ID',
    position VARCHAR(50) DEFAULT '成员' COMMENT '职位',
    status INT DEFAULT 0 COMMENT '状态：0-待审核，1-正常，2-退出',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (club_id) REFERENCES club(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
) COMMENT '社团成员表';

-- 活动表
CREATE TABLE IF NOT EXISTS activity (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    club_id INT NOT NULL COMMENT '社团ID',
    title VARCHAR(200) NOT NULL COMMENT '活动标题',
    content TEXT COMMENT '活动内容',
    start_time VARCHAR(50) DEFAULT NULL COMMENT '开始时间',
    end_time VARCHAR(50) DEFAULT NULL COMMENT '结束时间',
    location VARCHAR(200) DEFAULT NULL COMMENT '活动地点',
    max_participants INT DEFAULT 50 COMMENT '最大参与人数',
    current_participants INT DEFAULT 0 COMMENT '当前参与人数',
    status INT DEFAULT 0 COMMENT '状态：0-未开始，1-进行中，2-已结束，3-取消',
    creator_id INT NOT NULL COMMENT '创建者ID',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (club_id) REFERENCES club(id),
    FOREIGN KEY (creator_id) REFERENCES user(id)
) COMMENT '活动表';

-- 申请记录表
CREATE TABLE IF NOT EXISTS apply_record (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    club_id INT NOT NULL COMMENT '社团ID',
    user_id INT NOT NULL COMMENT '用户ID',
    reason TEXT COMMENT '申请理由',
    status INT DEFAULT 0 COMMENT '状态：0-待审核，1-通过，2-拒绝',
    reviewer_id INT DEFAULT NULL COMMENT '审核人ID',
    review_reason TEXT COMMENT '审核意见',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (club_id) REFERENCES club(id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (reviewer_id) REFERENCES user(id)
) COMMENT '申请记录表';

-- 通知表
CREATE TABLE IF NOT EXISTS notice (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    club_id INT NOT NULL COMMENT '社团ID',
    title VARCHAR(200) NOT NULL COMMENT '通知标题',
    content TEXT COMMENT '通知内容',
    status INT DEFAULT 0 COMMENT '状态：0-草稿，1-发布',
    creator_id INT NOT NULL COMMENT '创建者ID',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (club_id) REFERENCES club(id),
    FOREIGN KEY (creator_id) REFERENCES user(id)
) COMMENT '通知表';

-- 费用记录表
CREATE TABLE IF NOT EXISTS fee_record (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    club_id INT NOT NULL COMMENT '社团ID',
    user_id INT NOT NULL COMMENT '用户ID',
    type VARCHAR(50) NOT NULL COMMENT '费用类型',
    amount DECIMAL(10,2) NOT NULL COMMENT '金额',
    description VARCHAR(500) DEFAULT NULL COMMENT '费用说明',
    status INT DEFAULT 0 COMMENT '状态：0-待缴费，1-已缴费，2-逾期',
    creator_id INT NOT NULL COMMENT '创建者ID',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (club_id) REFERENCES club(id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (creator_id) REFERENCES user(id)
) COMMENT '费用记录表';

-- 初始化数据
-- 添加默认系统管理员账号
INSERT INTO user (username, password, real_name, sex, phone, email, user_type, status) VALUES 
('admin', 'e10adc3949ba59abbe56e057f20f883e', '系统管理员', '男', '13800138000', 'admin@example.com', 3, 1);

-- 添加社团类型
INSERT INTO club_type (name, description, status) VALUES 
('学术类', '学术科技、创新创业等社团', 1),
('文艺类', '文学艺术、文化传承等社团', 1),
('体育类', '体育健身、竞技比赛等社团', 1),
('公益类', '志愿服务、社会实践等社团', 1),
('兴趣类', '兴趣爱好、交友联谊等社团', 1);

-- 添加社团管理员示例
INSERT INTO user (username, password, real_name, sex, phone, email, user_type, status) VALUES 
('club_admin1', 'e10adc3949ba59abbe56e057f20f883e', '社团管理员1', '男', '13800138001', 'club_admin1@example.com', 2, 1),
('club_admin2', 'e10adc3949ba59abbe56e057f20f883e', '社团管理员2', '女', '13800138002', 'club_admin2@example.com', 2, 1);

-- 添加普通用户示例
INSERT INTO user (username, password, real_name, sex, phone, email, user_type, status) VALUES 
('user1', 'e10adc3949ba59abbe56e057f20f883e', '张三', '男', '13800138003', 'zhangsan@example.com', 1, 1),
('user2', 'e10adc3949ba59abbe56e057f20f883e', '李四', '女', '13800138004', 'lisi@example.com', 1, 1),
('user3', 'e10adc3949ba59abbe56e057f20f883e', '王五', '男', '13800138005', 'wangwu@example.com', 1, 1);

-- 添加社团示例
INSERT INTO club (name, description, club_type_id, established_time, member_count, status, admin_id) VALUES 
('计算机协会', '计算机技术交流、项目开发、技能培训', 1, '2020-09-01', 30, 1, 2),
('文学社', '文学创作、作品分享、文学沙龙', 2, '2019-10-15', 25, 1, 3),
('篮球俱乐部', '篮球训练、比赛交流、健身锻炼', 3, '2021-03-20', 40, 1, 2);