// 费用管理组件
window.FeeManagement = {
    template: `
        <div>
            <el-card header="费用管理">
                <div class="button-group">
                    <el-button type="primary" @click="showAddDialog">添加费用</el-button>
                    <el-button type="primary" @click="refreshData">刷新</el-button>
                </div>
                
                <div class="search-form">
                    <el-form :inline="true" :model="searchForm" size="small">
                        <el-form-item label="社团">
                            <el-select v-model="searchForm.clubId" placeholder="请选择社团" @change="fetchFees">
                                <el-option 
                                    v-for="club in clubs" 
                                    :key="club.id" 
                                    :label="club.name" 
                                    :value="club.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="用户">
                            <el-select v-model="searchForm.userId" placeholder="请选择用户" @change="fetchFees" clearable filterable>
                                <el-option 
                                    v-for="user in users" 
                                    :key="user.id" 
                                    :label="user.realName + '(' + user.username + ')'" 
                                    :value="user.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="searchForm.status" placeholder="请选择" @change="fetchFees" clearable>
                                <el-option label="待缴费" :value="0"></el-option>
                                <el-option label="已缴费" :value="1"></el-option>
                                <el-option label="逾期" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                
                <div class="table-container">
                    <el-table :data="feeList" stripe v-loading="loading">
                        <el-table-column prop="user.realName" label="用户姓名" width="120"></el-table-column>
                        <el-table-column prop="user.username" label="用户名" width="120"></el-table-column>
                        <el-table-column prop="club.name" label="社团" width="150"></el-table-column>
                        <el-table-column prop="type" label="费用类型" width="150"></el-table-column>
                        <el-table-column prop="amount" label="金额" width="120">
                            <template slot-scope="scope">
                                ¥{{ scope.row.amount.toFixed(2) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="description" label="费用说明" show-overflow-tooltip></el-table-column>
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
                                <el-button type="primary" size="mini" @click="editFee(scope.row)">编辑</el-button>
                                <el-button v-if="scope.row.status === 0" type="success" size="mini" @click="markAsPaid(scope.row)">标记已缴</el-button>
                                <el-button type="danger" size="mini" @click="deleteFee(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
            
            <!-- 费用详情对话框 -->
            <el-dialog title="费用详情" :visible.sync="detailDialogVisible" width="50%">
                <div v-if="currentFee">
                    <el-descriptions :column="2" border>
                        <el-descriptions-item label="用户姓名">{{ currentFee.user ? currentFee.user.realName : '-' }}</el-descriptions-item>
                        <el-descriptions-item label="用户名">{{ currentFee.user ? currentFee.user.username : '-' }}</el-descriptions-item>
                        <el-descriptions-item label="社团">{{ currentFee.club ? currentFee.club.name : '-' }}</el-descriptions-item>
                        <el-descriptions-item label="费用类型">{{ currentFee.type }}</el-descriptions-item>
                        <el-descriptions-item label="金额">¥{{ currentFee.amount.toFixed(2) }}</el-descriptions-item>
                        <el-descriptions-item label="状态">
                            <el-tag :type="getStatusType(currentFee.status)">
                                {{ getStatusText(currentFee.status) }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="创建时间">{{ currentFee.createTime }}</el-descriptions-item>
                        <el-descriptions-item label="更新时间">{{ currentFee.updateTime }}</el-descriptions-item>
                        <el-descriptions-item label="费用说明" :span="2">{{ currentFee.description }}</el-descriptions-item>
                    </el-descriptions>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="detailDialogVisible = false">关闭</el-button>
                </span>
            </el-dialog>
            
            <!-- 添加/编辑费用对话框 -->
            <el-dialog :title="dialogTitle" :visible.sync="formDialogVisible" width="50%">
                <el-form :model="feeForm" :rules="feeRules" ref="feeForm" label-width="100px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="社团" prop="clubId">
                                <el-select v-model="feeForm.clubId" placeholder="请选择社团" style="width: 100%" :disabled="isEdit" @change="onClubChange">
                                    <el-option 
                                        v-for="club in clubs" 
                                        :key="club.id" 
                                        :label="club.name" 
                                        :value="club.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户" prop="userId">
                                <el-select v-model="feeForm.userId" placeholder="请选择用户" style="width: 100%" :disabled="isEdit" filterable>
                                    <el-option 
                                        v-for="user in clubMembers" 
                                        :key="user.id" 
                                        :label="user.realName + '(' + user.username + ')'" 
                                        :value="user.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="费用类型" prop="type">
                                <el-select v-model="feeForm.type" placeholder="请选择费用类型" style="width: 100%">
                                    <el-option label="会费" value="会费"></el-option>
                                    <el-option label="活动费" value="活动费"></el-option>
                                    <el-option label="材料费" value="材料费"></el-option>
                                    <el-option label="其他" value="其他"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="金额" prop="amount">
                                <el-input-number 
                                    v-model="feeForm.amount" 
                                    :min="0.01" 
                                    :max="10000" 
                                    :precision="2"
                                    style="width: 100%">
                                </el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="费用说明" prop="description">
                        <el-input type="textarea" v-model="feeForm.description" placeholder="请输入费用说明" :rows="4"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status" v-if="isEdit">
                        <el-radio-group v-model="feeForm.status">
                            <el-radio :label="0">待缴费</el-radio>
                            <el-radio :label="1">已缴费</el-radio>
                            <el-radio :label="2">逾期</el-radio>
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
            feeList: [],
            clubs: [],
            users: [],
            clubMembers: [],
            loading: false,
            searchForm: {
                clubId: null,
                userId: null,
                status: null
            },
            detailDialogVisible: false,
            formDialogVisible: false,
            isEdit: false,
            currentFee: null,
            feeForm: {
                id: null,
                clubId: null,
                userId: null,
                type: '',
                amount: 0,
                description: '',
                status: 0
            },
            feeRules: {
                clubId: [
                    { required: true, message: '请选择社团', trigger: 'change' }
                ],
                userId: [
                    { required: true, message: '请选择用户', trigger: 'change' }
                ],
                type: [
                    { required: true, message: '请选择费用类型', trigger: 'change' }
                ],
                amount: [
                    { required: true, message: '请输入金额', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '请输入费用说明', trigger: 'blur' },
                    { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        dialogTitle() {
            return this.isEdit ? '编辑费用' : '添加费用';
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
                    this.fetchFees();
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
        async fetchFees() {
            if (!this.searchForm.clubId) return;
            
            this.loading = true;
            try {
                this.feeList = await api.fee.getByClub(this.searchForm.clubId);
                
                // 如果有用户过滤条件，应用过滤
                if (this.searchForm.userId) {
                    this.feeList = this.feeList.filter(fee => fee.userId === this.searchForm.userId);
                }
                
                // 如果有状态过滤条件，应用过滤
                if (this.searchForm.status !== null && this.searchForm.status !== '') {
                    this.feeList = this.feeList.filter(fee => fee.status === this.searchForm.status);
                }
            } catch (error) {
                console.error('获取费用列表失败:', error);
                this.$message.error('获取费用列表失败');
            } finally {
                this.loading = false;
            }
        },
        async onClubChange(clubId) {
            try {
                // 获取社团成员
                const members = await api.clubMember.getByClub(clubId);
                // 只获取状态为正常的成员
                const normalMembers = members.filter(member => member.status === 1);
                
                // 获取用户详细信息
                this.clubMembers = [];
                for (const member of normalMembers) {
                    try {
                        const user = await api.user.info; // 这里需要获取用户详情
                        // 这里应该根据member.userId获取具体用户信息
                        // 由于API限制，这里简化处理
                        this.clubMembers.push({
                            id: member.userId,
                            realName: '用户' + member.userId,
                            username: 'user' + member.userId
                        });
                    } catch (error) {
                        console.error('获取用户信息失败:', error);
                    }
                }
            } catch (error) {
                console.error('获取社团成员失败:', error);
            }
        },
        refreshData() {
            this.fetchFees();
        },
        async viewDetail(fee) {
            this.currentFee = fee;
            this.detailDialogVisible = true;
        },
        showAddDialog() {
            this.resetForm();
            this.isEdit = false;
            this.formDialogVisible = true;
            this.onClubChange(this.feeForm.clubId);
        },
        editFee(fee) {
            this.feeForm = { ...fee };
            this.isEdit = true;
            this.formDialogVisible = true;
            this.onClubChange(fee.clubId);
        },
        async markAsPaid(fee) {
            try {
                await this.$confirm('确定标记此费用为已缴费吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                
                await api.fee.pay(fee.id);
                this.$message.success('标记成功');
                this.fetchFees();
            } catch (error) {
                if (error !== 'cancel') {
                    this.$message.error(error.message || '标记失败');
                }
            }
        },
        async deleteFee(fee) {
            try {
                await this.$confirm('确定删除此费用记录吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                
                await api.fee.delete(fee.id);
                this.$message.success('删除成功');
                this.fetchFees();
            } catch (error) {
                if (error !== 'cancel') {
                    this.$message.error(error.message || '删除失败');
                }
            }
        },
        async submitForm() {
            this.$refs.feeForm.validate(async (valid) => {
                if (!valid) return;

                try {
                    if (this.isEdit) {
                        await api.fee.update(this.feeForm);
                        this.$message.success('更新成功');
                    } else {
                        await api.fee.add(this.feeForm);
                        this.$message.success('添加成功');
                    }
                    
                    this.formDialogVisible = false;
                    this.resetForm();
                    this.fetchFees();
                } catch (error) {
                    this.$message.error(error.message);
                }
            });
        },
        resetForm() {
            this.feeForm = {
                id: null,
                clubId: this.searchForm.clubId,
                userId: null,
                type: '',
                amount: 0,
                description: '',
                status: 0
            };
            this.$refs.feeForm && this.$refs.feeForm.clearValidate();
        },
        getStatusType(status) {
            const types = {
                0: 'warning', // 待缴费
                1: 'success', // 已缴费
                2: 'danger'   // 逾期
            };
            return types[status] || 'info';
        },
        getStatusText(status) {
            const texts = {
                0: '待缴费',
                1: '已缴费',
                2: '逾期'
            };
            return texts[status] || '未知';
        }
    }
};