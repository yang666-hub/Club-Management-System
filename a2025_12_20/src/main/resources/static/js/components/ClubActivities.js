// 社团活动管理组件
window.ClubActivities = {
    template: `
        <div>
            <el-card header="社团活动管理">
                <div class="button-group">
                    <el-button type="primary" @click="showAddDialog">添加活动</el-button>
                    <el-button type="primary" @click="refreshData">刷新</el-button>
                </div>
                
                <div class="search-form">
                    <el-form :inline="true" :model="searchForm" size="small">
                        <el-form-item label="社团">
                            <el-select v-model="searchForm.clubId" placeholder="请选择社团" @change="fetchActivities">
                                <el-option 
                                    v-for="club in clubs" 
                                    :key="club.id" 
                                    :label="club.name" 
                                    :value="club.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关键词">
                            <el-input v-model="searchForm.keyword" placeholder="请输入关键词" @change="fetchActivities"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                
                <div class="table-container">
                    <el-table :data="activityList" stripe v-loading="loading">
                        <el-table-column prop="title" label="活动标题" width="200"></el-table-column>
                        <el-table-column prop="startTime" label="开始时间" width="160"></el-table-column>
                        <el-table-column prop="endTime" label="结束时间" width="160"></el-table-column>
                        <el-table-column prop="location" label="活动地点" width="150"></el-table-column>
                        <el-table-column prop="maxParticipants" label="最大人数" width="100"></el-table-column>
                        <el-table-column prop="currentParticipants" label="当前人数" width="100"></el-table-column>
                        <el-table-column prop="status" label="状态" width="100">
                            <template slot-scope="scope">
                                <el-tag :type="getStatusType(scope.row.status)">
                                    {{ getStatusText(scope.row.status) }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="250">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="viewDetail(scope.row)">详情</el-button>
                                <el-button type="primary" size="mini" @click="editActivity(scope.row)">编辑</el-button>
                                <el-button type="danger" size="mini" @click="deleteActivity(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
            
            <!-- 活动详情对话框 -->
            <el-dialog title="活动详情" :visible.sync="detailDialogVisible" width="60%">
                <div v-if="currentActivity">
                    <el-descriptions :column="2" border>
                        <el-descriptions-item label="活动标题">{{ currentActivity.title }}</el-descriptions-item>
                        <el-descriptions-item label="主办社团">{{ currentActivity.club ? currentActivity.club.name : '-' }}</el-descriptions-item>
                        <el-descriptions-item label="开始时间">{{ currentActivity.startTime }}</el-descriptions-item>
                        <el-descriptions-item label="结束时间">{{ currentActivity.endTime }}</el-descriptions-item>
                        <el-descriptions-item label="活动地点">{{ currentActivity.location }}</el-descriptions-item>
                        <el-descriptions-item label="参与人数">
                            {{ currentActivity.currentParticipants }} / {{ currentActivity.maxParticipants }}
                        </el-descriptions-item>
                        <el-descriptions-item label="状态">
                            <el-tag :type="getStatusType(currentActivity.status)">
                                {{ getStatusText(currentActivity.status) }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="创建时间">{{ currentActivity.createTime }}</el-descriptions-item>
                        <el-descriptions-item label="活动内容" :span="2">
                            <div v-html="currentActivity.content"></div>
                        </el-descriptions-item>
                    </el-descriptions>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="detailDialogVisible = false">关闭</el-button>
                </span>
            </el-dialog>
            
            <!-- 添加/编辑活动对话框 -->
            <el-dialog :title="dialogTitle" :visible.sync="formDialogVisible" width="60%">
                <el-form :model="activityForm" :rules="activityRules" ref="activityForm" label-width="100px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="活动标题" prop="title">
                                <el-input v-model="activityForm.title" placeholder="请输入活动标题"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="社团" prop="clubId">
                                <el-select v-model="activityForm.clubId" placeholder="请选择社团" style="width: 100%" :disabled="isEdit">
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
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="开始时间" prop="startTime">
                                <el-date-picker
                                    v-model="activityForm.startTime"
                                    type="datetime"
                                    placeholder="选择开始时间"
                                    style="width: 100%"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="结束时间" prop="endTime">
                                <el-date-picker
                                    v-model="activityForm.endTime"
                                    type="datetime"
                                    placeholder="选择结束时间"
                                    style="width: 100%"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="活动地点" prop="location">
                                <el-input v-model="activityForm.location" placeholder="请输入活动地点"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="最大人数" prop="maxParticipants">
                                <el-input-number 
                                    v-model="activityForm.maxParticipants" 
                                    :min="1" 
                                    :max="1000" 
                                    style="width: 100%">
                                </el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="活动内容" prop="content">
                        <el-input type="textarea" v-model="activityForm.content" placeholder="请输入活动内容" :rows="6"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-radio-group v-model="activityForm.status">
                            <el-radio :label="0">未开始</el-radio>
                            <el-radio :label="1">进行中</el-radio>
                            <el-radio :label="2">已结束</el-radio>
                            <el-radio :label="3">取消</el-radio>
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
            activityList: [],
            clubs: [],
            loading: false,
            searchForm: {
                clubId: null,
                keyword: ''
            },
            detailDialogVisible: false,
            formDialogVisible: false,
            isEdit: false,
            currentActivity: null,
            activityForm: {
                id: null,
                clubId: null,
                title: '',
                content: '',
                startTime: '',
                endTime: '',
                location: '',
                maxParticipants: 50,
                currentParticipants: 0,
                status: 0
            },
            activityRules: {
                title: [
                    { required: true, message: '请输入活动标题', trigger: 'blur' },
                    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
                ],
                clubId: [
                    { required: true, message: '请选择社团', trigger: 'change' }
                ],
                startTime: [
                    { required: true, message: '请选择开始时间', trigger: 'change' }
                ],
                endTime: [
                    { required: true, message: '请选择结束时间', trigger: 'change' }
                ],
                location: [
                    { required: true, message: '请输入活动地点', trigger: 'blur' }
                ],
                maxParticipants: [
                    { required: true, message: '请输入最大人数', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入活动内容', trigger: 'blur' },
                    { min: 10, max: 2000, message: '长度在 10 到 2000 个字符', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        dialogTitle() {
            return this.isEdit ? '编辑活动' : '添加活动';
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
                    this.fetchActivities();
                }
            } catch (error) {
                console.error('获取社团列表失败:', error);
            }
        },
        async fetchActivities() {
            if (!this.searchForm.clubId) return;
            
            this.loading = true;
            try {
                this.activityList = await api.activity.getByClub(this.searchForm.clubId);
                
                // 如果有关键词过滤条件，应用过滤
                if (this.searchForm.keyword) {
                    this.activityList = this.activityList.filter(activity => 
                        activity.title.includes(this.searchForm.keyword) || 
                        activity.content.includes(this.searchForm.keyword)
                    );
                }
            } catch (error) {
                console.error('获取活动列表失败:', error);
                this.$message.error('获取活动列表失败');
            } finally {
                this.loading = false;
            }
        },
        refreshData() {
            this.fetchActivities();
        },
        async viewDetail(activity) {
            try {
                this.currentActivity = await api.activity.detail(activity.id);
                this.detailDialogVisible = true;
            } catch (error) {
                console.error('获取活动详情失败:', error);
                this.$message.error('获取活动详情失败');
            }
        },
        showAddDialog() {
            this.resetForm();
            this.isEdit = false;
            this.formDialogVisible = true;
        },
        editActivity(activity) {
            this.activityForm = { ...activity };
            this.isEdit = true;
            this.formDialogVisible = true;
        },
        async deleteActivity(activity) {
            try {
                await this.$confirm('确定删除此活动吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                
                await api.activity.delete(activity.id);
                this.$message.success('删除成功');
                this.fetchActivities();
            } catch (error) {
                if (error !== 'cancel') {
                    this.$message.error(error.message || '删除失败');
                }
            }
        },
        async submitForm() {
            this.$refs.activityForm.validate(async (valid) => {
                if (!valid) return;

                try {
                    if (this.isEdit) {
                        await api.activity.update(this.activityForm);
                        this.$message.success('更新成功');
                    } else {
                        await api.activity.add(this.activityForm);
                        this.$message.success('添加成功');
                    }
                    
                    this.formDialogVisible = false;
                    this.resetForm();
                    this.fetchActivities();
                } catch (error) {
                    this.$message.error(error.message);
                }
            });
        },
        resetForm() {
            this.activityForm = {
                id: null,
                clubId: this.searchForm.clubId,
                title: '',
                content: '',
                startTime: '',
                endTime: '',
                location: '',
                maxParticipants: 50,
                currentParticipants: 0,
                status: 0
            };
            this.$refs.activityForm && this.$refs.activityForm.clearValidate();
        },
        getStatusType(status) {
            const types = {
                0: 'info',    // 未开始
                1: 'success', // 进行中
                2: 'info',    // 已结束
                3: 'danger'   // 取消
            };
            return types[status] || 'info';
        },
        getStatusText(status) {
            const texts = {
                0: '未开始',
                1: '进行中',
                2: '已结束',
                3: '取消'
            };
            return texts[status] || '未知';
        }
    }
};