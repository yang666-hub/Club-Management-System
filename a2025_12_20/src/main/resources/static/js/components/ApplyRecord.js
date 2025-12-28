// 申请记录组件
window.ApplyRecord = {
    template: `
        <div>
            <el-card header="我的申请记录">
                <div class="table-container">
                    <el-table :data="applyList" stripe>
                        <el-table-column prop="club.name" label="社团名称" width="200"></el-table-column>
                        <el-table-column prop="reason" label="申请理由" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="status" label="状态" width="100">
                            <template slot-scope="scope">
                                <el-tag :type="getStatusType(scope.row.status)">
                                    {{ getStatusText(scope.row.status) }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="申请时间" width="160"></el-table-column>
                        <el-table-column prop="reviewReason" label="审核意见" show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </el-card>
        </div>
    `,
    data() {
        return {
            applyList: []
        };
    },
    created() {
        this.fetchApplies();
    },
    methods: {
        async fetchApplies() {
            try {
                this.applyList = await api.apply.my();
            } catch (error) {
                console.error('获取申请记录失败:', error);
                this.$message.error('获取申请记录失败');
            }
        },
        getStatusType(status) {
            const types = {
                0: 'info',    // 待审核
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