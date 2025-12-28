// 费用记录组件
window.FeeRecord = {
    template: `
        <div>
            <el-card header="我的费用记录">
                <div class="table-container">
                    <el-table :data="feeList" stripe>
                        <el-table-column prop="club.name" label="社团名称" width="200"></el-table-column>
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
                        <el-table-column label="操作" width="120">
                            <template slot-scope="scope">
                                <el-button 
                                    v-if="scope.row.status === 0" 
                                    type="primary" 
                                    size="mini" 
                                    @click="payFee(scope.row)">
                                    缴费
                                </el-button>
                                <span v-else>-</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
        </div>
    `,
    data() {
        return {
            feeList: []
        };
    },
    created() {
        this.fetchFees();
    },
    methods: {
        async fetchFees() {
            try {
                this.feeList = await api.fee.my();
            } catch (error) {
                console.error('获取费用记录失败:', error);
                this.$message.error('获取费用记录失败');
            }
        },
        async payFee(fee) {
            try {
                await this.$confirm('确认缴费吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                
                await api.fee.pay(fee.id);
                this.$message.success('缴费成功');
                this.fetchFees(); // 刷新列表
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('缴费失败:', error);
                    this.$message.error(error.message || '缴费失败');
                }
            }
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