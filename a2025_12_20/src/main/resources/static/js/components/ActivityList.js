// 活动列表组件
window.ActivityList = {
    template: `
        <div>
            <el-card header="活动列表">
                <div class="search-form">
                    <el-form :inline="true" :model="searchForm" size="small">
                        <el-form-item label="关键词">
                            <el-input v-model="searchForm.keyword" placeholder="请输入关键词" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="社团">
                            <el-select v-model="searchForm.clubId" placeholder="请选择社团" clearable>
                                <el-option 
                                    v-for="club in clubs" 
                                    :key="club.id" 
                                    :label="club.name" 
                                    :value="club.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchActivities">搜索</el-button>
                            <el-button @click="resetSearch">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                
                <div class="table-container">
                    <el-table :data="activityList" stripe>
                        <el-table-column prop="title" label="活动标题" width="200"></el-table-column>
                        <el-table-column prop="club.name" label="主办社团" width="150"></el-table-column>
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
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="viewDetail(scope.row)">详情</el-button>
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
        </div>
    `,
    data() {
        return {
            activityList: [],
            clubs: [],
            searchForm: {
                keyword: '',
                clubId: null
            },
            pagination: {
                current: 1,
                size: 10,
                total: 0
            },
            detailDialogVisible: false,
            currentActivity: null
        };
    },
    created() {
        this.fetchClubs();
        this.fetchActivities();
    },
    methods: {
        async fetchClubs() {
            try {
                // 获取正常状态的社团
                const result = await api.club.list({ status: 1, size: 100 });
                this.clubs = result.records;
            } catch (error) {
                console.error('获取社团列表失败:', error);
            }
        },
        async fetchActivities() {
            try {
                const params = {
                    current: this.pagination.current,
                    size: this.pagination.size,
                    keyword: this.searchForm.keyword,
                    clubId: this.searchForm.clubId
                };
                
                const result = await api.activity.list(params);
                this.activityList = result.records;
                this.pagination.total = result.total;
            } catch (error) {
                console.error('获取活动列表失败:', error);
                this.$message.error('获取活动列表失败');
            }
        },
        searchActivities() {
            this.pagination.current = 1;
            this.fetchActivities();
        },
        resetSearch() {
            this.searchForm = {
                keyword: '',
                clubId: null
            };
            this.searchActivities();
        },
        handleSizeChange(size) {
            this.pagination.size = size;
            this.pagination.current = 1;
            this.fetchActivities();
        },
        handleCurrentChange(current) {
            this.pagination.current = current;
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