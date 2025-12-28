// 用户管理组件
window.UserManagement = {
    template: `
        <div>
            <el-card header="用户管理">
                <div class="button-group">
                    <el-button type="primary" @click="showAddDialog">添加用户</el-button>
                    <el-button type="primary" @click="refreshData">刷新</el-button>
                </div>
                
                <div class="search-form">
                    <el-form :inline="true" :model="searchForm" size="small">
                        <el-form-item label="关键词">
                            <el-input v-model="searchForm.keyword" placeholder="用户名/姓名/手机/邮箱" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchUsers">搜索</el-button>
                            <el-button @click="resetSearch">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                
                <div class="table-container">
                    <el-table :data="userList" stripe>
                        <el-table-column prop="username" label="用户名" width="150"></el-table-column>
                        <el-table-column prop="realName" label="真实姓名" width="120"></el-table-column>
                        <el-table-column prop="sex" label="性别" width="80"></el-table-column>
                        <el-table-column prop="phone" label="手机号" width="130"></el-table-column>
                        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
                        <el-table-column prop="userType" label="用户类型" width="120">
                            <template slot-scope="scope">
                                <el-tag :type="getUserTypeType(scope.row.userType)">
                                    {{ getUserTypeText(scope.row.userType) }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态" width="100">
                            <template slot-scope="scope">
                                <el-tag :type="getStatusType(scope.row.status)">
                                    {{ getStatusText(scope.row.status) }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="viewDetail(scope.row)">详情</el-button>
                                <el-button type="primary" size="mini" @click="editUser(scope.row)">编辑</el-button>
                                <el-button type="danger" size="mini" @click="deleteUser(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    
                    <div class="pagination-container">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pagination.current"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="pagination.size"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="pagination.total">
                        </el-pagination>
                    </div>
                </div>
            </el-card>
            
            <!-- 用户详情对话框 -->
            <el-dialog title="用户详情" :visible.sync="detailDialogVisible" width="50%">
                <div v-if="currentUser">
                    <el-descriptions :column="2" border>
                        <el-descriptions-item label="用户名">{{ currentUser.username }}</el-descriptions-item>
                        <el-descriptions-item label="真实姓名">{{ currentUser.realName }}</el-descriptions-item>
                        <el-descriptions-item label="性别">{{ currentUser.sex }}</el-descriptions-item>
                        <el-descriptions-item label="手机号">{{ currentUser.phone }}</el-descriptions-item>
                        <el-descriptions-item label="邮箱">{{ currentUser.email }}</el-descriptions-item>
                        <el-descriptions-item label="用户类型">
                            <el-tag :type="getUserTypeType(currentUser.userType)">
                                {{ getUserTypeText(currentUser.userType) }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="状态">
                            <el-tag :type="getStatusType(currentUser.status)">
                                {{ getStatusText(currentUser.status) }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="创建时间">{{ currentUser.createTime }}</el-descriptions-item>
                        <el-descriptions-item label="更新时间">{{ currentUser.updateTime }}</el-descriptions-item>
                    </el-descriptions>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="detailDialogVisible = false">关闭</el-button>
                </span>
            </el-dialog>
            
            <!-- 添加/编辑用户对话框 -->
            <el-dialog :title="dialogTitle" :visible.sync="formDialogVisible" width="50%">
                <el-form :model="userForm" :rules="userRules" ref="userForm" label-width="100px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="userForm.username" placeholder="请输入用户名" :disabled="isEdit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="密码" prop="password" v-if="!isEdit">
                                <el-input v-model="userForm.password" type="password" placeholder="请输入密码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="真实姓名" prop="realName">
                                <el-input v-model="userForm.realName" placeholder="请输入真实姓名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别" prop="sex">
                                <el-radio-group v-model="userForm.sex">
                                    <el-radio label="男">男</el-radio>
                                    <el-radio label="女">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="手机号" prop="phone">
                                <el-input v-model="userForm.phone" placeholder="请输入手机号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="用户类型" prop="userType">
                                <el-select v-model="userForm.userType" placeholder="请选择用户类型" style="width: 100%">
                                    <el-option label="普通用户" :value="1"></el-option>
                                    <el-option label="社团管理员" :value="2"></el-option>
                                    <el-option label="系统管理员" :value="3"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态" prop="status">
                                <el-radio-group v-model="userForm.status">
                                    <el-radio :label="0">禁用</el-radio>
                                    <el-radio :label="1">启用</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="formDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm">确定</el-button>
                </span>
            </el-dialog>
        </div>
    `,
    data() {
        return {
            userList: [],
            searchForm: {
                keyword: ''
            },
            pagination: {
                current: 1,
                size: 10,
                total: 0
            },
            detailDialogVisible: false,
            formDialogVisible: false,
            isEdit: false,
            currentUser: null,
            userForm: {
                id: null,
                username: '',
                password: '',
                realName: '',
                sex: '男',
                phone: '',
                email: '',
                userType: 1,
                status: 1
            },
            userRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
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
                ],
                userType: [
                    { required: true, message: '请选择用户类型', trigger: 'change' }
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ]
            }
        };
    },
    computed: {
        dialogTitle() {
            return this.isEdit ? '编辑用户' : '添加用户';
        }
    },
    created() {
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            try {
                const params = {
                    current: this.pagination.current,
                    size: this.pagination.size,
                    keyword: this.searchForm.keyword
                };
                
                const result = await api.user.list(params);
                this.userList = result.records;
                this.pagination.total = result.total;
            } catch (error) {
                console.error('获取用户列表失败:', error);
                this.$message.error('获取用户列表失败');
            }
        },
        searchUsers() {
            this.pagination.current = 1;
            this.fetchUsers();
        },
        resetSearch() {
            this.searchForm = {
                keyword: ''
            };
            this.searchUsers();
        },
        handleSizeChange(size) {
            this.pagination.size = size;
            this.pagination.current = 1;
            this.fetchUsers();
        },
        handleCurrentChange(current) {
            this.pagination.current = current;
            this.fetchUsers();
        },
        refreshData() {
            this.fetchUsers();
        },
        viewDetail(user) {
            this.currentUser = user;
            this.detailDialogVisible = true;
        },
        showAddDialog() {
            this.resetForm();
            this.isEdit = false;
            this.formDialogVisible = true;
        },
        editUser(user) {
            this.userForm = { ...user };
            this.isEdit = true;
            this.formDialogVisible = true;
        },
        async deleteUser(user) {
            try {
                await this.$confirm('确定删除此用户吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                
                await api.user.delete(user.id);
                this.$message.success('删除成功');
                this.fetchUsers();
            } catch (error) {
                if (error !== 'cancel') {
                    this.$message.error(error.message || '删除失败');
                }
            }
        },
        async submitForm() {
            this.$refs.userForm.validate(async (valid) => {
                if (!valid) return;

                try {
                    if (this.isEdit) {
                        await api.user.update(this.userForm);
                        this.$message.success('更新成功');
                    } else {
                        await api.user.add(this.userForm);
                        this.$message.success('添加成功');
                    }
                    
                    this.formDialogVisible = false;
                    this.resetForm();
                    this.fetchUsers();
                } catch (error) {
                    this.$message.error(error.message);
                }
            });
        },
        resetForm() {
            this.userForm = {
                id: null,
                username: '',
                password: '',
                realName: '',
                sex: '男',
                phone: '',
                email: '',
                userType: 1,
                status: 1
            };
            this.$refs.userForm && this.$refs.userForm.clearValidate();
        },
        getUserTypeType(userType) {
            const types = {
                1: '',       // 普通用户
                2: 'warning', // 社团管理员
                3: 'danger'   // 系统管理员
            };
            return types[userType] || '';
        },
        getUserTypeText(userType) {
            const texts = {
                1: '普通用户',
                2: '社团管理员',
                3: '系统管理员'
            };
            return texts[userType] || '未知';
        },
        getStatusType(status) {
            const types = {
                0: 'danger', // 禁用
                1: 'success'  // 启用
            };
            return types[status] || '';
        },
        getStatusText(status) {
            const texts = {
                0: '禁用',
                1: '启用'
            };
            return texts[status] || '未知';
        }
    }
};