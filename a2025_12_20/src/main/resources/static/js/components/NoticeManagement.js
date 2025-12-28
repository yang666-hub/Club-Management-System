// 通知管理组件
window.NoticeManagement = {
    template: `
        <div>
            <el-card header="通知管理">
                <div class="button-group">
                    <el-button type="primary" @click="showAddDialog">添加通知</el-button>
                    <el-button type="primary" @click="refreshData">刷新</el-button>
                </div>
                
                <div class="search-form">
                    <el-form :inline="true" :model="searchForm" size="small">
                        <el-form-item label="社团">
                            <el-select v-model="searchForm.clubId" placeholder="请选择社团" @change="fetchNotices">
                                <el-option 
                                    v-for="club in clubs" 
                                    :key="club.id" 
                                    :label="club.name" 
                                    :value="club.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关键词">
                            <el-input v-model="searchForm.keyword" placeholder="请输入关键词" @change="fetchNotices"></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="searchForm.status" placeholder="请选择" @change="fetchNotices" clearable>
                                <el-option label="草稿" :value="0"></el-option>
                                <el-option label="已发布" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                
                <div class="table-container">
                    <el-table :data="noticeList" stripe v-loading="loading">
                        <el-table-column prop="title" label="通知标题" width="200"></el-table-column>
                        <el-table-column prop="club.name" label="社团" width="150"></el-table-column>
                        <el-table-column prop="status" label="状态" width="100">
                            <template slot-scope="scope">
                                <el-tag :type="getStatusType(scope.row.status)">
                                    {{ getStatusText(scope.row.status) }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
                        <el-table-column prop="updateTime" label="更新时间" width="160"></el-table-column>
                        <el-table-column label="操作" width="300">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="viewDetail(scope.row)">详情</el-button>
                                <el-button type="primary" size="mini" @click="editNotice(scope.row)">编辑</el-button>
                                <el-button v-if="scope.row.status === 0" type="success" size="mini" @click="publishNotice(scope.row)">发布</el-button>
                                <el-button type="danger" size="mini" @click="deleteNotice(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
            
            <!-- 通知详情对话框 -->
            <el-dialog title="通知详情" :visible.sync="detailDialogVisible" width="60%">
                <div v-if="currentNotice">
                    <el-descriptions :column="2" border>
                        <el-descriptions-item label="通知标题">{{ currentNotice.title }}</el-descriptions-item>
                        <el-descriptions-item label="社团">{{ currentNotice.club ? currentNotice.club.name : '-' }}</el-descriptions-item>
                        <el-descriptions-item label="状态">
                            <el-tag :type="getStatusType(currentNotice.status)">
                                {{ getStatusText(currentNotice.status) }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="创建时间">{{ currentNotice.createTime }}</el-descriptions-item>
                        <el-descriptions-item label="更新时间">{{ currentNotice.updateTime }}</el-descriptions-item>
                        <el-descriptions-item label="通知内容" :span="2">
                            <div v-html="currentNotice.content"></div>
                        </el-descriptions-item>
                    </el-descriptions>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="detailDialogVisible = false">关闭</el-button>
                </span>
            </el-dialog>
            
            <!-- 添加/编辑通知对话框 -->
            <el-dialog :title="dialogTitle" :visible.sync="formDialogVisible" width="60%">
                <el-form :model="noticeForm" :rules="noticeRules" ref="noticeForm" label-width="100px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="通知标题" prop="title">
                                <el-input v-model="noticeForm.title" placeholder="请输入通知标题"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="社团" prop="clubId">
                                <el-select v-model="noticeForm.clubId" placeholder="请选择社团" style="width: 100%" :disabled="isEdit">
                                    <el-option 
                                        v-for="club in clubs" 
                                        :key="club.id" 
                                        :label="club.name" 
                                        :value="club.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="通知内容" prop="content">
                        <el-input type="textarea" v-model="noticeForm.content" placeholder="请输入通知内容" :rows="8"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-radio-group v-model="noticeForm.status">
                            <el-radio :label="0">草稿</el-radio>
                            <el-radio :label="1">发布</el-radio>
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
            noticeList: [],
            clubs: [],
            loading: false,
            searchForm: {
                clubId: null,
                keyword: '',
                status: null
            },
            detailDialogVisible: false,
            formDialogVisible: false,
            isEdit: false,
            currentNotice: null,
            noticeForm: {
                id: null,
                clubId: null,
                title: '',
                content: '',
                status: 0
            },
            noticeRules: {
                title: [
                    { required: true, message: '请输入通知标题', trigger: 'blur' },
                    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
                ],
                clubId: [
                    { required: true, message: '请选择社团', trigger: 'change' }
                ],
                content: [
                    { required: true, message: '请输入通知内容', trigger: 'blur' },
                    { min: 10, max: 2000, message: '长度在 10 到 2000 个字符', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        dialogTitle() {
            return this.isEdit ? '编辑通知' : '添加通知';
        }
    },
    created() {
        this.fetchClubs();
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
                    this.fetchNotices();
                }
            } catch (error) {
                console.error('获取社团列表失败:', error);
            }
        },
        async fetchNotices() {
            if (!this.searchForm.clubId) return;
            
            this.loading = true;
            try {
                this.noticeList = await api.notice.getByClub(this.searchForm.clubId);
                
                // 如果有关键词过滤条件，应用过滤
                if (this.searchForm.keyword) {
                    this.noticeList = this.noticeList.filter(notice => 
                        notice.title.includes(this.searchForm.keyword) || 
                        notice.content.includes(this.searchForm.keyword)
                    );
                }
                
                // 如果有状态过滤条件，应用过滤
                if (this.searchForm.status !== null && this.searchForm.status !== '') {
                    this.noticeList = this.noticeList.filter(notice => notice.status === this.searchForm.status);
                }
            } catch (error) {
                console.error('获取通知列表失败:', error);
                this.$message.error('获取通知列表失败');
            } finally {
                this.loading = false;
            }
        },
        refreshData() {
            this.fetchNotices();
        },
        async viewDetail(notice) {
            try {
                this.currentNotice = await api.notice.detail(notice.id);
                this.detailDialogVisible = true;
            } catch (error) {
                console.error('获取通知详情失败:', error);
                this.$message.error('获取通知详情失败');
            }
        },
        showAddDialog() {
            this.resetForm();
            this.isEdit = false;
            this.formDialogVisible = true;
        },
        editNotice(notice) {
            this.noticeForm = { ...notice };
            this.isEdit = true;
            this.formDialogVisible = true;
        },
        async publishNotice(notice) {
            try {
                await this.$confirm('确定发布此通知吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                
                await api.notice.publish(notice.id);
                this.$message.success('发布成功');
                this.fetchNotices();
            } catch (error) {
                if (error !== 'cancel') {
                    this.$message.error(error.message || '发布失败');
                }
            }
        },
        async deleteNotice(notice) {
            try {
                await this.$confirm('确定删除此通知吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                
                await api.notice.delete(notice.id);
                this.$message.success('删除成功');
                this.fetchNotices();
            } catch (error) {
                if (error !== 'cancel') {
                    this.$message.error(error.message || '删除失败');
                }
            }
        },
        async submitForm() {
            this.$refs.noticeForm.validate(async (valid) => {
                if (!valid) return;

                try {
                    if (this.isEdit) {
                        await api.notice.update(this.noticeForm);
                        this.$message.success('更新成功');
                    } else {
                        await api.notice.add(this.noticeForm);
                        this.$message.success('添加成功');
                    }
                    
                    this.formDialogVisible = false;
                    this.resetForm();
                    this.fetchNotices();
                } catch (error) {
                    this.$message.error(error.message);
                }
            });
        },
        resetForm() {
            this.noticeForm = {
                id: null,
                clubId: this.searchForm.clubId,
                title: '',
                content: '',
                status: 0
            };
            this.$refs.noticeForm && this.$refs.noticeForm.clearValidate();
        },
        getStatusType(status) {
            const types = {
                0: 'info',    // 草稿
                1: 'success'  // 已发布
            };
            return types[status] || 'info';
        },
        getStatusText(status) {
            const texts = {
                0: '草稿',
                1: '已发布'
            };
            return texts[status] || '未知';
        }
    }
};