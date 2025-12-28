// 成员管理组件
window.MemberManagement = {
    template: `
        <div>
            <el-card header="成员管理">
                <div class="button-group">
                    <el-button type="primary" @click="showAddDialog">添加成员</el-button>
                    <el-button type="primary" @click="refreshData">刷新</el-button>
                </div>
                
                <div class="search-form">
                    <el-form :inline="true" :model="searchForm" size="small">
                        <el-form-item label="社团">
                            <el-select v-model="searchForm.clubId" placeholder="请选择社团" @change="fetchMembers">
                                <el-option 
                                    v-for="club in clubs" 
                                    :key="club.id" 
                                    :label="club.name" 
                                    :value="club.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="searchForm.status" placeholder="请选择" @change="fetchMembers" clearable>
                                <el-option label="待审核" :value="0"></el-option>
                                <el-option label="正常" :value="1"></el-option>
                                <el-option label="退出" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                
                <div class="table-container">
                    <el-table :data="memberList" stripe v-loading="loading">
                        <el-table-column prop="user.realName" label="姓名" width="120"></el-table-column>
                        <el-table-column prop="user.username" label="用户名" width="120"></el-table-column>
                        <el-table-column prop="position" label="职位" width="120"></el-table-column>
                        <el-table-column prop="status" label="状态" width="100">
                            <template slot-scope="scope">
                                <el-tag :type="getStatusType(scope.row.status)">
                                    {{ getStatusText(scope.row.status) }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="加入时间" width="160"></el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.status === 0" type="success" size="mini" @click="approveMember(scope.row)">通过</el-button>
                                <el-button v-if="scope.row.status === 0" type="danger" size="mini" @click="rejectMember(scope.row)">拒绝</el-button>
                                <el-button v-if="scope.row.status === 1" type="primary" size="mini" @click="editMember(scope.row)">编辑</el-button>
                                <el-button v-if="scope.row.status === 1" type="warning" size="mini" @click="removeMember(scope.row)">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
            
            <!-- 添加/编辑成员对话框 -->
            <el-dialog :title="dialogTitle" :visible.sync="formDialogVisible" width="40%">
                <el-form :model="memberForm" :rules="memberRules" ref="memberForm" label-width="100px">
                    <el-form-item label="社团" prop="clubId">
                        <el-select v-model="memberForm.clubId" placeholder="请选择社团" style="width: 100%" :disabled="isEdit">
                            <el-option 
                                v-for="club in clubs" 
                                :key="club.id" 
                                :label="club.name" 
                                :value="club.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用户" prop="userId">
                        <el-select v-model="memberForm.userId" placeholder="请选择用户" style="width: 100%" :disabled="isEdit" filterable>
                            <el-option 
                                v-for="user in users" 
                                :key="user.id" 
                                :label="user.realName + '(' + user.username + ')'" 
                                :value="user.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="职位" prop="position">
                        <el-input v-model="memberForm.position" placeholder="请输入职位"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status" v-if="isEdit">
                        <el-radio-group v-model="memberForm.status">
                            <el-radio :label="1">正常</el-radio>
                            <el-radio :label="2">退出</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="formDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm">确定</el-button>
                </span>
            </el-dialog>
        </div>
    `,
    props: ['userInfo', 'userType'],
    data() {
        return {
            memberList: [],
            clubs: [],
            users: [],
            loading: false,
            searchForm: {
                clubId: null,
                status: null
            },
            formDialogVisible: false,
            isEdit: false,
            memberForm: {
                id: null,
                clubId: null,
                userId: null,
                position: '',
                status: 1
            },
            memberRules: {
                clubId: [
                    { required: true, message: '请选择社团', trigger: 'change' }
                ],
                userId: [
                    { required: true, message: '请选择用户', trigger: 'change' }
                ],
                position: [
                    { required: true, message: '请输入职位', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        dialogTitle() {
            return this.isEdit ? '编辑成员' : '添加成员';
        }
    },
    created() {
        this.fetchClubs();
        this.fetchUsers();
    },
    methods: {
        async fetchClubs() {
            try {
                // 如果是社团管理员，只获取自己管理的社团；如果是系统管理员，获取所有社团
                const params = this.userType === 2 ? { adminId: this.userInfo.id } : {};
                const result = await api.club.list(params);
                this.clubs = result.records;
                
                // 如果有社团，默认选择第一个
                if (this.clubs.length > 0 && !this.searchForm.clubId) {
                    this.searchForm.clubId = this.clubs[0].id;
                    this.fetchMembers();
                }
            } catch (error) {
                console.error('获取社团列表失败:', error);
            }
        },
        async fetchUsers() {
            try {
                const result = await api.user.list({ size: 1000 });
                this.users = result.records;
            } catch (error) {
                console.error('获取用户列表失败:', error);
            }
        },
        async fetchMembers() {
            if (!this.searchForm.clubId) return;
            
            this.loading = true;
            try {
                this.memberList = await api.clubMember.getByClub(this.searchForm.clubId);
                
                // 如果有状态过滤条件，应用过滤
                if (this.searchForm.status !== null && this.searchForm.status !== '') {
                    this.memberList = this.memberList.filter(member => member.status === this.searchForm.status);
                }
            } catch (error) {
                console.error('获取成员列表失败:', error);
                this.$message.error('获取成员列表失败');
            } finally {
                this.loading = false;
            }
        },
        refreshData() {
            this.fetchMembers();
        },
        showAddDialog() {
            this.resetForm();
            this.isEdit = false;
            this.formDialogVisible = true;
        },
        editMember(member) {
            this.memberForm = { ...member };
            this.isEdit = true;
            this.formDialogVisible = true;
        },
        async approveMember(member) {
            try {
                await api.clubMember.approve(member.id);
                this.$message.success('审核通过');
                this.fetchMembers();
            } catch (error) {
                this.$message.error(error.message || '操作失败');
            }
        },
        async rejectMember(member) {
            try {
                await api.clubMember.reject(member.id);
                this.$message.success('已拒绝');
                this.fetchMembers();
            } catch (error) {
                this.$message.error(error.message || '操作失败');
            }
        },
        async removeMember(member) {
            try {
                await this.$confirm('确定移除此成员吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                
                // 修改状态为退出
                member.status = 2;
                await api.clubMember.update(member);
                this.$message.success('移除成功');
                this.fetchMembers();
            } catch (error) {
                if (error !== 'cancel') {
                    this.$message.error(error.message || '操作失败');
                }
            }
        },
        async submitForm() {
            this.$refs.memberForm.validate(async (valid) => {
                if (!valid) return;

                try {
                    if (this.isEdit) {
                        await api.clubMember.update(this.memberForm);
                        this.$message.success('更新成功');
                    } else {
                        await api.clubMember.add(this.memberForm);
                        this.$message.success('添加成功');
                    }
                    
                    this.formDialogVisible = false;
                    this.resetForm();
                    this.fetchMembers();
                } catch (error) {
                    this.$message.error(error.message);
                }
            });
        },
        resetForm() {
            this.memberForm = {
                id: null,
                clubId: this.searchForm.clubId,
                userId: null,
                position: '',
                status: 1
            };
            this.$refs.memberForm && this.$refs.memberForm.clearValidate();
        },
        getStatusType(status) {
            const types = {
                0: 'warning', // 待审核
                1: 'success', // 正常
                2: 'info'     // 退出
            };
            return types[status] || 'info';
        },
        getStatusText(status) {
            const texts = {
                0: '待审核',
                1: '正常',
                2: '退出'
            };
            return texts[status] || '未知';
        }
    }
};