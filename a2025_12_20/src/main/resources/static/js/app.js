// 主应用初始化函数
function initVueApp() {
    console.log('开始初始化Vue应用...');
    console.log('当前window对象中可用的组件:', Object.keys(window).filter(key => key.includes('Login') || key.includes('User') || key.includes('Club') || key.includes('Activity') || key.includes('Apply') || key.includes('Fee') || key.includes('Notice') || key.includes('Member') || key.includes('System') || key.includes('Type')));
    
    // 检查所有组件是否已加载
    const requiredComponents = [
        'LoginRegister', 'UserProfile', 'ClubList', 'ActivityList', 
        'ApplyRecord', 'FeeRecord', 'ClubInfo', 'MemberManagement',
        'ApplyManagement', 'ClubActivities', 'NoticeManagement', 
        'FeeManagement', 'UserManagement', 'ClubTypeManagement',
        'SystemClubManagement'
    ];
    
    // 检查每个组件是否已定义
    const componentStatus = {};
    requiredComponents.forEach(name => {
        componentStatus[name] = typeof window[name] !== 'undefined';
        console.log(`组件 ${name}: ${componentStatus[name] ? '已加载' : '未加载'}`);
    });
    
    // 检查组件是否已定义
    const missingComponents = requiredComponents.filter(name => typeof window[name] === 'undefined');
    
    if (missingComponents.length === 0) {
        // 注册所有组件
        Vue.component('login-register', LoginRegister);
        Vue.component('UserProfile', UserProfile);
        Vue.component('ClubList', ClubList);
        Vue.component('ActivityList', ActivityList);
        Vue.component('ApplyRecord', ApplyRecord);
        Vue.component('FeeRecord', FeeRecord);
        Vue.component('ClubInfo', ClubInfo);
        Vue.component('MemberManagement', MemberManagement);
        Vue.component('ApplyManagement', ApplyManagement);
        Vue.component('ClubActivities', ClubActivities);
        Vue.component('NoticeManagement', NoticeManagement);
        Vue.component('FeeManagement', FeeManagement);
        Vue.component('UserManagement', UserManagement);
        Vue.component('ClubTypeManagement', ClubTypeManagement);
        Vue.component('SystemClubManagement', SystemClubManagement);
        
        // 使用现有组件作为系统管理组件
        Vue.component('SystemMemberManagement', MemberManagement);
        Vue.component('SystemActivityManagement', ClubActivities);
        Vue.component('SystemNoticeManagement', NoticeManagement);
        Vue.component('SystemApplyManagement', ApplyManagement);
        Vue.component('SystemFeeManagement', FeeManagement);
        
        // 初始化Vue应用
        createVueInstance();
        } else {
            console.error('以下组件未加载完成:', missingComponents);
            // 尝试延迟初始化
            setTimeout(initVueApp, 2000);
        }
}

// 创建Vue实例
function createVueInstance() {
    const app = new Vue({
        el: '#app',
        data() {
            return {
                isLoggedIn: false,
                userInfo: null,
                userType: 0,
                currentComponent: null,
                activeMenu: '1-1'
            };
        },
        created() {
            // 检查是否已登录
            this.checkAuth();
        },
        methods: {
            checkAuth() {
                if (auth.isLoggedIn()) {
                    this.isLoggedIn = true;
                    this.userInfo = auth.getUserInfo();
                    this.userType = auth.getUserType();
                    this.currentComponent = 'UserProfile';
                    this.activeMenu = '1-1';
                } else {
                    this.isLoggedIn = false;
                }
            },
            handleLoginSuccess() {
                this.checkAuth();
            },
            navigateTo(componentName) {
                // 根据组件名设置当前组件
                this.currentComponent = componentName;
            },
            logout() {
                auth.clearAuth();
                this.isLoggedIn = false;
                this.userInfo = null;
                this.userType = 0;
                this.currentComponent = null;
                this.$message.success('退出登录成功');
            }
        }
    });
}

// 添加Axios请求拦截器
axios.interceptors.request.use(config => {
    const token = auth.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 初始化应用
initVueApp();

// 添加Axios响应拦截器
axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        auth.clearAuth();
        window.location.reload();
    }
    return Promise.reject(error);
});