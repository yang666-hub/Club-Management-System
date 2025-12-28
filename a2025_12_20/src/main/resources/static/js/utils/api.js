// API请求工具类
const API_BASE_URL = 'http://localhost:8080/api';

const api = {
    // 获取请求头
    getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    },

    // 处理响应
    handleResponse(response) {
        if (response.data.code === 200) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || '请求失败');
        }
    },

    // 处理错误
    handleError(error) {
        console.error('API请求错误:', error);
        let message = '网络错误，请稍后再试';
        if (error.response) {
            if (error.response.status === 401) {
                message = '登录已过期，请重新登录';
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                window.location.reload();
            } else if (error.response.data && error.response.data.message) {
                message = error.response.data.message;
            }
        } else if (error.message) {
            message = error.message;
        }
        throw new Error(message);
    },

    // GET请求
    get(url, params = {}) {
        return axios.get(API_BASE_URL + url, {
            headers: this.getHeaders(),
            params
        }).then(this.handleResponse).catch(this.handleError);
    },

    // POST请求
    post(url, data = {}) {
        return axios.post(API_BASE_URL + url, data, {
            headers: this.getHeaders()
        }).then(this.handleResponse).catch(this.handleError);
    },

    // PUT请求
    put(url, data = {}) {
        return axios.put(API_BASE_URL + url, data, {
            headers: this.getHeaders()
        }).then(this.handleResponse).catch(this.handleError);
    },

    // DELETE请求
    delete(url) {
        return axios.delete(API_BASE_URL + url, {
            headers: this.getHeaders()
        }).then(this.handleResponse).catch(this.handleError);
    },

    // 用户相关API
    user: {
        login(userData) {
            return api.post('/user/login', userData);
        },
        register(userData) {
            return api.post('/user/register', userData);
        },
        getInfo() {
            return api.get('/user/info');
        },
        update(userData) {
            return api.put('/user/update', userData);
        },
        list(params) {
            return api.get('/user/list', params);
        },
        add(userData) {
            return api.post('/user/add', userData);
        },
        delete(id) {
            return api.delete(`/user/delete/${id}`);
        }
    },

    // 社团相关API
    club: {
        list(params) {
            return api.get('/club/list', params);
        },
        detail(id) {
            return api.get(`/club/detail/${id}`);
        },
        add(clubData) {
            return api.post('/club/add', clubData);
        },
        update(clubData) {
            return api.put('/club/update', clubData);
        },
        delete(id) {
            return api.delete(`/club/delete/${id}`);
        },
        my() {
            return api.get('/club/my');
        }
    },

    // 社团类型相关API
    clubType: {
        list() {
            return api.get('/clubType/list');
        },
        detail(id) {
            return api.get(`/clubType/detail/${id}`);
        },
        add(clubTypeData) {
            return api.post('/clubType/add', clubTypeData);
        },
        update(clubTypeData) {
            return api.put('/clubType/update', clubTypeData);
        },
        delete(id) {
            return api.delete(`/clubType/delete/${id}`);
        }
    },

    // 活动相关API
    activity: {
        list(params) {
            return api.get('/activity/list', params);
        },
        detail(id) {
            return api.get(`/activity/detail/${id}`);
        },
        getByClub(clubId) {
            return api.get(`/activity/club/${clubId}`);
        },
        add(activityData) {
            return api.post('/activity/add', activityData);
        },
        update(activityData) {
            return api.put('/activity/update', activityData);
        },
        delete(id) {
            return api.delete(`/activity/delete/${id}`);
        }
    },

    // 申请记录相关API
    apply: {
        list(params) {
            return api.get('/apply/list', params);
        },
        my() {
            return api.get('/apply/my');
        },
        getByClub(clubId) {
            return api.get(`/apply/club/${clubId}`);
        },
        add(applyData) {
            return api.post('/apply/add', applyData);
        },
        review(applyData) {
            return api.put('/apply/review', applyData);
        }
    },

    // 通知相关API
    notice: {
        list(params) {
            return api.get('/notice/list', params);
        },
        detail(id) {
            return api.get(`/notice/detail/${id}`);
        },
        getByClub(clubId) {
            return api.get(`/notice/club/${clubId}`);
        },
        add(noticeData) {
            return api.post('/notice/add', noticeData);
        },
        update(noticeData) {
            return api.put('/notice/update', noticeData);
        },
        publish(id) {
            return api.put(`/notice/publish/${id}`);
        },
        delete(id) {
            return api.delete(`/notice/delete/${id}`);
        }
    },

    // 费用记录相关API
    fee: {
        list(params) {
            return api.get('/fee/list', params);
        },
        my() {
            return api.get('/fee/my');
        },
        getByClub(clubId) {
            return api.get(`/fee/club/${clubId}`);
        },
        add(feeData) {
            return api.post('/fee/add', feeData);
        },
        update(feeData) {
            return api.put('/fee/update', feeData);
        },
        pay(id) {
            return api.put(`/fee/pay/${id}`);
        },
        delete(id) {
            return api.delete(`/fee/delete/${id}`);
        }
    },

    // 社团成员相关API
    clubMember: {
        getByClub(clubId) {
            return api.get(`/clubMember/club/${clubId}`);
        },
        my() {
            return api.get('/clubMember/my');
        },
        add(memberData) {
            return api.post('/clubMember/add', memberData);
        },
        update(memberData) {
            return api.put('/clubMember/update', memberData);
        },
        delete(id) {
            return api.delete(`/clubMember/delete/${id}`);
        },
        join(joinData) {
            return api.post('/clubMember/join', joinData);
        },
        approve(id) {
            return api.put(`/clubMember/approve/${id}`);
        },
        reject(id) {
            return api.put(`/clubMember/reject/${id}`);
        }
    }
};