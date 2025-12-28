// 申请处理组件
window.ApplyManagement = {
    template: `
        <div>
            <el-card header="入团申请处理">
                <div class="search-form">
                    <el-form :inline="true" :model="searchForm" size="small">
                        <el-form-item label="社团">
                            <el-select v-model="searchForm.clubId" placeholder="请选择社团" @change="fetchApplies">
                                <el-option 
                                    v-for="club in clubs" 
                                    :key="club.id" 
                                    :label="club.name" 
                                    :value="club.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="searchForm.status" placeholder="请选择" @change="fetchApplies" clearable>
                                <el-option label="待审核" :value="0"></el-option>
                                <el-option label="通过" :value="1"></el-option>
                                <el-option label="拒绝" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                
                <div class="table-container">
                    <el-table :data="applyList" stripe v-loading="loading">
                        <el-table-column prop="user.realName" label="申请人" width="120"></el-table-column>
                        <el-table-column prop="user.username" label="用户名" width="120"></el-table-column>
                        <el-table-column prop="user.phone" label="手机号" width="130"></el-table-column>
                        <el-table-column prop="club.name" label="申请社团" width="150"></el-table-column>
                        <el-table-column prop="reason" label="申请理由" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="status" label="状态" width="100">
                            <template slot-scope="scope">
                                <el-tag :type="getStatusType(scope.row.status)">
                                    {{ getStatusText(scope.row.status) }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="申请时间" width="160"></el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.status === 0" type="success" size="mini" @click="approveApply(scope.row)">通过</el-button>
                                <el-button v-if="scope.row.status === 0" type="danger" size="mini" @click="rejectApply(scope.row)">拒绝</el-button>
                                <el-button size="mini" @click="viewDetail(scope.row)">详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
            
            <!-- 申请详情对话框 -->
            <el-dialog title="申请详情" :visible.sync="detailDialogVisible" width="50%">
                <div v-if="currentApply">
                    <el-descriptions :column="2" border>
                        <el-descriptions-item label="申请人">{{ currentApply.user ? currentApply.user.realName : '-' }}</el-descriptions-item>
                        <el-descriptions-item label="用户名">{{ currentApply.user ? currentApply.user.username : '-' }}</el-descriptions-item>
                        <el-descriptions-item label="手机号">{{ currentApply.user ? currentApply.user.phone : '-' }}</el-descriptions-item>
                        <el-descriptions-item label="邮箱">{{ currentApply.user ? currentApply.user.email : '-' }}</el-descriptions-item>
                        <el-descriptions-item label="申请社团">{{ currentApply.club ? currentApply.club.name : '-' }}</el-descriptions-item>
                        <el-descriptions-item label="状态">
                            <el-tag :type="getStatusType(currentApply.status)">
                                {{ getStatusText(currentApply.status) }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="申请时间">{{ currentApply.createTime }}</el-descriptions-item>
                        <el-descriptions-item label="审核时间">{{ currentApply.updateTime }}</el-descriptions-item>
                        <el-descriptions-item label="申请理由" :span="2">{{ currentApply.reason }}</el-descriptions-item>
                        <el-descriptions-item label="审核意见" :span="2">{{ currentApply.reviewReason || '暂无' }}</el-descriptions-item>
                    </el-descriptions>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="detailDialogVisible = false">关闭</el-button>
                </span>
            </el-dialog>
            
            <!-- 审核对话框 -->
            <el-dialog :title="reviewDialogTitle" :visible.sync="reviewDialogVisible" width="50%">
                <el-form :model="reviewForm" ref="reviewForm" label-width="80px">
                    <el-form-item label="审核意见" prop="reviewReason">
                        <el-input type="textarea" v-model="reviewForm.reviewReason" placeholder="请输入审核意见" :rows="4"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="reviewDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitReview">确定</el-button>
                </span>
            </el-dialog>
        </div>
    `,
    props: ['userInfo', 'userType'],
    data() {
        return {
            applyList: [],
            clubs: [],
            loading: false,
            searchForm: {
                clubId: null,
                status: null
            },
            detailDialogVisible: false,
            reviewDialogVisible: false,
            currentApply: null,
            isApprove: true,
            reviewForm: {
                id: null,
                status: 1,
                reviewReason: ''
            }
        };
    },
    computed: {
        reviewDialogTitle() {
            return this.isApprove ? '审核通过' : '审核拒绝';
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
                    this.fetchApplies();
                }
            } catch (error) {
                console.error('获取社团列表失败:', error);
            }
        },
        async fetchApplies() {
            if (!this.searchForm.clubId) return;
            
            this.loading = true;
            try {
                this.applyList = await api.apply.getByClub(this.searchForm.clubId);
                
                // 如果有状态过滤条件，应用过滤
                if (this.searchForm.status !== null && this.searchForm.status !== '') {
                    this.applyList = this.applyList.filter(apply => apply.status === this.searchForm.status);
                }
            } catch (error) {
                console.error('获取申请列表失败:', error);
                this.$message.error('获取申请列表失败');
            } finally {
                this.loading = false;
            }
        },
        viewDetail(apply) {
            this.currentApply = apply;
            this.detailDialogVisible = true;
        },
        approveApply(apply) {
            this.currentApply = apply;
            this.isApprove = true;
            this.reviewForm = {
                id: apply.id,
                status: 1,
                reviewReason: '审核通过'
            };
            this.reviewDialogVisible = true;
        },
        rejectApply(apply) {
            this.currentApply = apply;
            this.isApprove = false;
            this.reviewForm = {
                id: apply.id,
                status: 2,
                reviewReason: ''
            };
            this.reviewDialogVisible = true;
        },
        async submitReview() {
            try {
                await api.apply.review(this.reviewForm);
                this.$message.success('审核成功');
                this.reviewDialogVisible = false;
                this.fetchApplies();
                
                // 如果审核通过，自动添加为社团成员
                if (this.reviewForm.status === 1) {
                    try {
                        await api.clubMember.add({
                            clubId: this.currentApply.clubId,
                            userId: this.currentApply.userId,
                            position: '成员',
                            status: 1
                        });
                    } catch (error) {
                        console.error('添加社团成员失败:', error);
                    }
                }
            } catch (error) {
                this.$message.error(error.message || '审核失败');
            }
        },
        getStatusType(status) {
            const types = {
                0: 'warning', // 待审核
                1: 'success', // 通过
                2: 'danger'   // 拒绝
            };
            return types[status] || 'info';
        },
        getStatusText(status) {
            const texts = {
                0: '待审核',
                1: '通过',
                2: '拒绝'
            };
            return texts[status] || '未知';
        }
    }
};