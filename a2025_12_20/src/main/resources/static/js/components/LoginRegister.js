// 登录注册组件
window.LoginRegister = {
    template: `
        <div class="login-container">
            <div class="login-box">
                <h2 class="login-title">{{ isLogin ? '用户登录' : '用户注册' }}</h2>
                <el-form :model="form" :rules="rules" ref="form" label-width="80px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPassword" v-if="!isLogin">
                        <el-input v-model="form.confirmPassword" type="password" placeholder="请确认密码"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="realName" v-if="!isLogin">
                        <el-input v-model="form.realName" placeholder="请输入真实姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex" v-if="!isLogin">
                        <el-radio-group v-model="form.sex">
                            <el-radio label="男">男</el-radio>
                            <el-radio label="女">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone" v-if="!isLogin">
                        <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email" v-if="!isLogin">
                        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm">{{ isLogin ? '登录' : '注册' }}</el-button>
                        <el-button @click="toggleForm">{{ isLogin ? '注册账号' : '返回登录' }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    `,
    data() {
        // 密码确认验证
        const validateConfirmPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };

        return {
            isLogin: true,
            form: {
                username: '',
                password: '',
                confirmPassword: '',
                realName: '',
                sex: '男',
                phone: '',
                email: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
                ],
                realName: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        submitForm() {
            this.$refs.form.validate(async (valid) => {
                if (!valid) return;

                try {
                    if (this.isLogin) {
                        // 登录
                        const response = await api.user.login({
                            username: this.form.username,
                            password: this.form.password
                        });
                        
                        // 保存token
                        auth.setToken(response);
                        
                        // 获取用户信息
                        const userInfo = await api.user.getInfo();
                        auth.setUserInfo(userInfo);
                        
                        // 登录成功，通知父组件
                        this.$emit('login-success');
                        this.$message.success('登录成功');
                    } else {
                        // 注册
                        await api.user.register({
                            username: this.form.username,
                            password: this.form.password,
                            realName: this.form.realName,
                            sex: this.form.sex,
                            phone: this.form.phone,
                            email: this.form.email
                        });
                        
                        this.$message.success('注册成功，请登录');
                        this.resetForm();
                        this.toggleForm();
                    }
                } catch (error) {
                    this.$message.error(error.message);
                }
            });
        },
        toggleForm() {
            this.isLogin = !this.isLogin;
            this.resetForm();
            this.$refs.form.clearValidate();
        },
        resetForm() {
            this.form = {
                username: '',
                password: '',
                confirmPassword: '',
                realName: '',
                sex: '男',
                phone: '',
                email: ''
            };
        }
    }
};