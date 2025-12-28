// 社团信息管理组件
window.ClubInfo = {
    template: `
        <div>
            <el-card header="社团信息管理">
                <div class="button-group">
                    <el-button type="primary" @click="showAddDialog" v-if="userType >= 2">添加社团</el-button>
                    <el-button type="primary" @click="refreshData">刷新</el-button>
                </div>
                
                <div class="search-form">
                    <el-form :inline="true" :model="searchForm" size="small">
                        <el-form-item label="关键词">
                            <el-input v-model="searchForm.keyword" placeholder="请输入关键词" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="社团类型">
                            <el-select v-model="searchForm.clubTypeId" placeholder="请选择" clearable>
                                <el-option 
                                    v-for="type in clubTypes" 
                                    :key="type.id" 
                                    :label="type.name" 
                                    :value="type.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchClubs">搜索</el-button>
                            <el-button @click="resetSearch">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                
                <div class="table-container">
                    <el-table :data="clubList" stripe>
                        <el-table-column prop="name" label="社团名称" width="200"></el-table-column>
                        <el-table-column prop="clubType.name" label="社团类型" width="150"></el-table-column>
                        <el-table-column prop="description" label="社团简介" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="establishedTime" label="成立时间" width="120"></el-table-column>
                        <el-table-column prop="memberCount" label="成员数量" width="100"></el-table-column>
                        <el-table-column prop="status" label="状态" width="100">
                            <template slot-scope="scope">
                                <el-tag :type="getStatusType(scope.row.status)">
                                    {{ getStatusText(scope.row.status) }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="viewDetail(scope.row)">详情</el-button>
                                <el-button v-if="canEdit(scope.row)" type="primary" size="mini" @click="editClub(scope.row)">编辑</el-button>
                                <el-button v-if="canDelete(scope.row)" type="danger" size="mini" @click="deleteClub(scope.row)">删除</el-button>
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
            
            <!-- 社团详情对话框 -->
            <el-dialog title="社团详情" :visible.sync="detailDialogVisible" width="60%">
                <div v-if="currentClub">
                    <el-descriptions :column="2" border>
                        <el-descriptions-item label="社团名称">{{ currentClub.name }}</el-descriptions-item>
                        <el-descriptions-item label="社团类型">{{ currentClub.clubType ? currentClub.clubType.name : '-' }}</el-descriptions-item>
                        <el-descriptions-item label="成立时间">{{ currentClub.establishedTime }}</el-descriptions-item>
                        <el-descriptions-item label="成员数量">{{ currentClub.memberCount }}</el-descriptions-item>
                        <el-descriptions-item label="状态">
                            <el-tag :type="getStatusType(currentClub.status)">
                                {{ getStatusText(currentClub.status) }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="Logo">
                            <img v-if="currentClub.logo" :src="currentClub.logo" style="width: 100px; height: 100px;" />
                            <span v-else>暂无</span>
                        </el-descriptions-item>
                        <el-descriptions-item label="社团简介" :span="2">{{ currentClub.description }}</el-descriptions-item>
                    </el-descriptions>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="detailDialogVisible = false">关闭</el-button>
                </span>
            </el-dialog>
            
            <!-- 添加/编辑社团对话框 -->
            <el-dialog :title="dialogTitle" :visible.sync="formDialogVisible" width="60%">
                <el-form :model="clubForm" :rules="clubRules" ref="clubForm" label-width="100px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="社团名称" prop="name">
                                <el-input v-model="clubForm.name" placeholder="请输入社团名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="社团类型" prop="clubTypeId">
                                <el-select v-model="clubForm.clubTypeId" placeholder="请选择社团类型" style="width: 100%">
                                    <el-option 
                                        v-for="type in clubTypes" 
                                        :key="type.id" 
                                        :label="type.name" 
                                        :value="type.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="成立时间" prop="establishedTime">
                                <el-date-picker
                                    v-model="clubForm.establishedTime"
                                    type="date"
                                    placeholder="选择成立时间"
                                    style="width: 100%"
                                    value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="社团Logo" prop="logo">
                                <el-input v-model="clubForm.logo" placeholder="请输入Logo URL"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="社团简介" prop="description">
                        <el-input type="textarea" v-model="clubForm.description" placeholder="请输入社团简介" :rows="4"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status" v-if="userType === 3">
                        <el-radio-group v-model="clubForm.status">
                            <el-radio :label="0">待审核</el-radio>
                            <el-radio :label="1">正常</el-radio>
                            <el-radio :label="2">解散</el-radio>
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
            clubList: [],
            clubTypes: [],
            searchForm: {
                keyword: '',
                clubTypeId: null
            },
            pagination: {
                current: 1,
                size: 10,
                total: 0
            },
            detailDialogVisible: false,
            formDialogVisible: false,
            isEdit: false,
            currentClub: null,
            clubForm: {
                id: null,
                name: '',
                clubTypeId: null,
                description: '',
                establishedTime: '',
                logo: '',
                memberCount: 0,
                status: 1
            },
            clubRules: {
                name: [
                    { required: true, message: '请输入社团名称', trigger: 'blur' },
                    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
                ],
                clubTypeId: [
                    { required: true, message: '请选择社团类型', trigger: 'change' }
                ],
                description: [
                    { required: true, message: '请输入社团简介', trigger: 'blur' },
                    { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
                ],
                establishedTime: [
                    { required: true, message: '请选择成立时间', trigger: 'change' }
                ]
            }
        };
    },
    computed: {
        dialogTitle() {
            return this.isEdit ? '编辑社团' : '添加社团';
        }
    },
    created() {
        this.fetchClubTypes();
        this.fetchClubs();
    },
    methods: {
        async fetchClubTypes() {
            try {
                this.clubTypes = await api.clubType.list();
            } catch (error) {
                console.error('获取社团类型失败:', error);
            }
        },
        async fetchClubs() {
            try {
                const params = {
                    current: this.pagination.current,
                    size: this.pagination.size,
                    keyword: this.searchForm.keyword,
                    clubTypeId: this.searchForm.clubTypeId
                };
                
                const result = await api.club.list(params);
                this.clubList = result.records;
                this.pagination.total = result.total;
            } catch (error) {
                console.error('获取社团列表失败:', error);
                this.$message.error('获取社团列表失败');
            }
        },
        searchClubs() {
            this.pagination.current = 1;
            this.fetchClubs();
        },
        resetSearch() {
            this.searchForm = {
                keyword: '',
                clubTypeId: null
            };
            this.searchClubs();
        },
        handleSizeChange(size) {
            this.pagination.size = size;
            this.pagination.current = 1;
            this.fetchClubs();
        },
        handleCurrentChange(current) {
            this.pagination.current = current;
            this.fetchClubs();
        },
        refreshData() {
            this.fetchClubs();
        },
        viewDetail(club) {
            this.currentClub = club;
            this.detailDialogVisible = true;
        },
        showAddDialog() {
            this.resetForm();
            this.isEdit = false;
            this.formDialogVisible = true;
        },
        editClub(club) {
            this.clubForm = { ...club };
            this.isEdit = true;
            this.formDialogVisible = true;
        },
        async deleteClub(club) {
            try {
                await this.$confirm('确定删除此社团吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                
                await api.club.delete(club.id);
                this.$message.success('删除成功');
                this.fetchClubs();
            } catch (error) {
                if (error !== 'cancel') {
                    this.$message.error(error.message || '删除失败');
                }
            }
        },
        async submitForm() {
            this.$refs.clubForm.validate(async (valid) => {
                if (!valid) return;

                try {
                    if (this.isEdit) {
                        await api.club.update(this.clubForm);
                        this.$message.success('更新成功');
                    } else {
                        await api.club.add(this.clubForm);
                        this.$message.success('添加成功');
                    }
                    
                    this.formDialogVisible = false;
                    this.resetForm();
                    this.fetchClubs();
                } catch (error) {
                    this.$message.error(error.message);
                }
            });
        },
        resetForm() {
            this.clubForm = {
                id: null,
                name: '',
                clubTypeId: null,
                description: '',
                establishedTime: '',
                logo: '',
                memberCount: 0,
                status: 1
            };
            this.$refs.clubForm && this.$refs.clubForm.clearValidate();
        },
        canEdit(club) {
            // 系统管理员可以编辑任何社团，社团管理员只能编辑自己管理的社团
            return this.userType === 3 || (this.userType === 2 && club.adminId === this.userInfo.id);
        },
        canDelete(club) {
            // 只有系统管理员可以删除社团
            return this.userType === 3;
        },
        getStatusType(status) {
            const types = {
                0: 'info',    // 待审核
                1: 'success', // 正常
                2: 'danger'   // 解散
            };
            return types[status] || 'info';
        },
        getStatusText(status) {
            const texts = {
                0: '待审核',
                1: '正常',
                2: '解散'
            };
            return texts[status] || '未知';
        }
    }
};