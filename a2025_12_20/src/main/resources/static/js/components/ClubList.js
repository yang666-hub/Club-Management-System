// 社团列表组件
window.ClubList = {
    template: `
        <div>
            <el-card header="社团列表">
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
                        <el-table-column label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="viewDetail(scope.row)">详情</el-button>
                                <el-button 
                                    v-if="userType === 1 && scope.row.status === 1" 
                                    type="primary" 
                                    size="mini" 
                                    @click="applyJoin(scope.row)">
                                    申请加入
                                </el-button>
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
                    <el-button 
                        v-if="userType === 1 && currentClub && currentClub.status === 1" 
                        type="primary" 
                        @click="applyJoin(currentClub)">
                        申请加入
                    </el-button>
                </span>
            </el-dialog>
            
            <!-- 申请加入对话框 -->
            <el-dialog title="申请加入社团" :visible.sync="applyDialogVisible" width="40%">
                <el-form :model="applyForm" :rules="applyRules" ref="applyForm" label-width="80px">
                    <el-form-item label="申请理由" prop="reason">
                        <el-input type="textarea" v-model="applyForm.reason" placeholder="请输入申请理由" :rows="4"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="applyDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitApply">提交申请</el-button>
                </span>
            </el-dialog>
        </div>
    `,
    props: ['userType'],
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
            currentClub: null,
            applyDialogVisible: false,
            applyForm: {
                clubId: null,
                reason: ''
            },
            applyRules: {
                reason: [
                    { required: true, message: '请输入申请理由', trigger: 'blur' },
                    { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
                ]
            }
        };
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
        viewDetail(club) {
            this.currentClub = club;
            this.detailDialogVisible = true;
        },
        applyJoin(club) {
            this.detailDialogVisible = false;
            this.applyForm.clubId = club.id;
            this.applyDialogVisible = true;
        },
        async submitApply() {
            this.$refs.applyForm.validate(async (valid) => {
                if (!valid) return;

                try {
                    await api.apply.add(this.applyForm);
                    this.$message.success('申请提交成功，请等待审核');
                    this.applyDialogVisible = false;
                    this.applyForm = { clubId: null, reason: '' };
                    this.$refs.applyForm.resetFields();
                } catch (error) {
                    this.$message.error(error.message);
                }
            });
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