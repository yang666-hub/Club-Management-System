// 社团类型管理组件
window.ClubTypeManagement = {
    template: `
        <div>
            <el-card header="社团类型管理">
                <div class="button-group">
                    <el-button type="primary" @click="showAddDialog">添加类型</el-button>
                    <el-button type="primary" @click="refreshData">刷新</el-button>
                </div>
                
                <div class="table-container">
                    <el-table :data="clubTypeList" stripe>
                        <el-table-column prop="name" label="类型名称" width="200"></el-table-column>
                        <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="status" label="状态" width="100">
                            <template slot-scope="scope">
                                <el-tag :type="getStatusType(scope.row.status)">
                                    {{ getStatusText(scope.row.status) }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
                        <el-table-column prop="updateTime" label="更新时间" width="160"></el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="viewDetail(scope.row)">详情</el-button>
                                <el-button type="primary" size="mini" @click="editClubType(scope.row)">编辑</el-button>
                                <el-button type="danger" size="mini" @click="deleteClubType(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
            
            <!-- 类型详情对话框 -->
            <el-dialog title="社团类型详情" :visible.sync="detailDialogVisible" width="50%">
                <div v-if="currentClubType">
                    <el-descriptions :column="2" border>
                        <el-descriptions-item label="类型名称">{{ currentClubType.name }}</el-descriptions-item>
                        <el-descriptions-item label="状态">
                            <el-tag :type="getStatusType(currentClubType.status)">
                                {{ getStatusText(currentClubType.status) }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="创建时间">{{ currentClubType.createTime }}</el-descriptions-item>
                        <el-descriptions-item label="更新时间">{{ currentClubType.updateTime }}</el-descriptions-item>
                        <el-descriptions-item label="描述" :span="2">{{ currentClubType.description }}</el-descriptions-item>
                    </el-descriptions>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="detailDialogVisible = false">关闭</el-button>
                </span>
            </el-dialog>
            
            <!-- 添加/编辑类型对话框 -->
            <el-dialog :title="dialogTitle" :visible.sync="formDialogVisible" width="50%">
                <el-form :model="clubTypeForm" :rules="clubTypeRules" ref="clubTypeForm" label-width="100px">
                    <el-form-item label="类型名称" prop="name">
                        <el-input v-model="clubTypeForm.name" placeholder="请输入类型名称"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input type="textarea" v-model="clubTypeForm.description" placeholder="请输入描述" :rows="4"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-radio-group v-model="clubTypeForm.status">
                            <el-radio :label="0">禁用</el-radio>
                            <el-radio :label="1">启用</el-radio>
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
    data() {
        return {
            clubTypeList: [],
            detailDialogVisible: false,
            formDialogVisible: false,
            isEdit: false,
            currentClubType: null,
            clubTypeForm: {
                id: null,
                name: '',
                description: '',
                status: 1
            },
            clubTypeRules: {
                name: [
                    { required: true, message: '请输入类型名称', trigger: 'blur' },
                    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '请输入描述', trigger: 'blur' },
                    { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ]
            }
        };
    },
    computed: {
        dialogTitle() {
            return this.isEdit ? '编辑类型' : '添加类型';
        }
    },
    created() {
        this.fetchClubTypes();
    },
    methods: {
        async fetchClubTypes() {
            try {
                this.clubTypeList = await api.clubType.list();
            } catch (error) {
                console.error('获取社团类型列表失败:', error);
                this.$message.error('获取社团类型列表失败');
            }
        },
        refreshData() {
            this.fetchClubTypes();
        },
        viewDetail(clubType) {
            this.currentClubType = clubType;
            this.detailDialogVisible = true;
        },
        showAddDialog() {
            this.resetForm();
            this.isEdit = false;
            this.formDialogVisible = true;
        },
        editClubType(clubType) {
            this.clubTypeForm = { ...clubType };
            this.isEdit = true;
            this.formDialogVisible = true;
        },
        async deleteClubType(clubType) {
            try {
                await this.$confirm('确定删除此社团类型吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                
                await api.clubType.delete(clubType.id);
                this.$message.success('删除成功');
                this.fetchClubTypes();
            } catch (error) {
                if (error !== 'cancel') {
                    this.$message.error(error.message || '删除失败');
                }
            }
        },
        async submitForm() {
            this.$refs.clubTypeForm.validate(async (valid) => {
                if (!valid) return;

                try {
                    if (this.isEdit) {
                        await api.clubType.update(this.clubTypeForm);
                        this.$message.success('更新成功');
                    } else {
                        await api.clubType.add(this.clubTypeForm);
                        this.$message.success('添加成功');
                    }
                    
                    this.formDialogVisible = false;
                    this.resetForm();
                    this.fetchClubTypes();
                } catch (error) {
                    this.$message.error(error.message);
                }
            });
        },
        resetForm() {
            this.clubTypeForm = {
                id: null,
                name: '',
                description: '',
                status: 1
            };
            this.$refs.clubTypeForm && this.$refs.clubTypeForm.clearValidate();
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