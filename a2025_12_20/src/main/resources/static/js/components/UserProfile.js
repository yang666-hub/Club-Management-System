// 用户个人信息组件
window.UserProfile = {
    template: `
        <div class="form-container">
            <el-card header="个人信息">
                <el-form :model="userInfo" :rules="rules" ref="userForm" label-width="100px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="userInfo.username" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="真实姓名" prop="realName">
                                <el-input v-model="userInfo.realName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="性别" prop="sex">
                                <el-radio-group v-model="userInfo.sex">
                                    <el-radio label="男">男</el-radio>
                                    <el-radio label="女">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号" prop="phone">
                                <el-input v-model="userInfo.phone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="userInfo.email"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户类型" prop="userType">
                                <el-select v-model="userInfo.userType" :disabled="true" style="width: 100%">
                                    <el-option label="普通用户" :value="1"></el-option>
                                    <el-option label="社团管理员" :value="2"></el-option>
                                    <el-option label="系统管理员" :value="3"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="updateProfile">保存修改</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    `,
    props: ['userInfo', 'userType'],
    data() {
        return {
            originalUserInfo: {},
            rules: {
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
    created() {
        // 保存原始用户信息用于重置
        this.originalUserInfo = { ...this.userInfo };
    },
    methods: {
        async updateProfile() {
            this.$refs.userForm.validate(async (valid) => {
                if (!valid) return;

                try {
                    await api.user.update(this.userInfo);
                    auth.setUserInfo(this.userInfo); // 更新本地存储的用户信息
                    this.originalUserInfo = { ...this.userInfo }; // 更新原始信息
                    this.$message.success('个人信息更新成功');
                } catch (error) {
                    this.$message.error(error.message);
                }
            });
        },
        resetForm() {
            // 恢复到原始数据
            Object.assign(this.userInfo, this.originalUserInfo);
            this.$refs.userForm.clearValidate();
        }
    }
};