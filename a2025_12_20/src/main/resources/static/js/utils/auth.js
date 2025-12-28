// 认证工具类
const auth = {
    // 保存token
    setToken(token) {
        localStorage.setItem('token', token);
    },

    // 获取token
    getToken() {
        return localStorage.getItem('token');
    },

    // 删除token
    removeToken() {
        localStorage.removeItem('token');
    },

    // 保存用户信息
    setUserInfo(userInfo) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    },

    // 获取用户信息
    getUserInfo() {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    },

    // 删除用户信息
    removeUserInfo() {
        localStorage.removeItem('userInfo');
    },

    // 清除所有认证信息
    clearAuth() {
        this.removeToken();
        this.removeUserInfo();
    },

    // 检查是否已登录
    isLoggedIn() {
        return !!this.getToken();
    },

    // 获取用户类型
    getUserType() {
        const userInfo = this.getUserInfo();
        return userInfo ? userInfo.userType : 0;
    },

    // 检查用户权限
    hasPermission(requiredType) {
        const userType = this.getUserType();
        return userType >= requiredType;
    },

    // 检查是否为系统管理员
    isSystemAdmin() {
        return this.getUserType() === 3;
    },

    // 检查是否为社团管理员
    isClubAdmin() {
        return this.getUserType() === 2;
    },

    // 检查是否为普通用户
    isNormalUser() {
        return this.getUserType() === 1;
    }
};