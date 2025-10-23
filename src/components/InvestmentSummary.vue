<template>
  <div class="investment-summary">
    <n-grid :cols="4" :x-gap="16" :y-gap="16" responsive="screen">
      <!-- 总投资金额 -->
      <n-grid-item span="1">
        <SummaryCard
          title="总投资金额"
          :value="formatCurrency(summaryData.totalInvestment)"
          icon="💰"
          color="#1890ff"
          :loading="loading"
        />
      </n-grid-item>

      <!-- 当前持仓价值 -->
      <n-grid-item span="1">
        <SummaryCard
          title="当前持仓价值"
          :value="formatCurrency(summaryData.totalCurrentValue)"
          icon="📈"
          color="#52c41a"
          :loading="loading"
        />
      </n-grid-item>

      <!-- 未实现收益 -->
      <n-grid-item span="1">
        <SummaryCard
          title="未实现收益"
          :value="formatCurrency(summaryData.totalUnrealizedGain)"
          :sub-value="formatPercent(summaryData.totalProfitRate)"
          icon="💵"
          :color="summaryData.totalUnrealizedGain >= 0 ? '#52c41a' : '#ff4d4f'"
          :loading="loading"
        />
      </n-grid-item>

      <!-- 持有股票数 -->
      <n-grid-item span="1">
        <SummaryCard
          title="持有股票"
          :value="summaryData.holdingStocks + ' 只'"
          icon="📊"
          color="#722ed1"
          :loading="loading"
        />
      </n-grid-item>

      <!-- 总持股数 -->
      <n-grid-item span="1">
        <SummaryCard
          title="总持股数"
          :value="formatNumber(summaryData.totalShares) + ' 股'"
          icon="🏢"
          color="#fa8c16"
          :loading="loading"
        />
      </n-grid-item>

      <!-- 交易次数 -->
      <n-grid-item span="1">
        <SummaryCard
          title="交易次数"
          :value="summaryData.totalTransactions + ' 次'"
          icon="🔄"
          color="#13c2c2"
          :loading="loading"
        />
      </n-grid-item>

      <!-- 活跃投资人 -->
      <n-grid-item span="1">
        <SummaryCard
          title="活跃投资人"
          :value="summaryData.activeInvestors + ' 人'"
          icon="👥"
          color="#eb2f96"
          :loading="loading"
        />
      </n-grid-item>

      <!-- 平均持仓成本 -->
      <n-grid-item span="1">
        <SummaryCard
          title="平均持仓成本"
          :value="formatCurrency(calculateAverageCost())"
          icon="⚖️"
          color="#595959"
          :loading="loading"
        />
      </n-grid-item>
    </n-grid>

    <!-- 收益趋势图表区域（预留） -->
    <div v-if="showChart" class="chart-section">
      <n-card title="收益趋势分析" :bordered="false">
        <div class="chart-placeholder">
          <n-empty description="图表功能开发中..." />
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SummaryCard from './SummaryCard.vue'

// Props
const props = defineProps({
  summaryData: {
    type: Object,
    default: () => ({
      totalInvestment: 0,
      totalCurrentValue: 0,
      totalUnrealizedGain: 0,
      totalProfitRate: 0,
      holdingStocks: 0,
      totalShares: 0,
      totalTransactions: 0,
      activeInvestors: 0
    })
  },
  loading: {
    type: Boolean,
    default: false
  },
  showChart: {
    type: Boolean,
    default: false
  }
})

// 方法
const formatCurrency = (value) => {
  if (value == null) return '¥0.00'
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const formatNumber = (value) => {
  if (value == null) return '0'
  return new Intl.NumberFormat('zh-CN').format(value)
}

const formatPercent = (value) => {
  if (value == null) return '0.00%'
  return value.toFixed(2) + '%'
}

const calculateAverageCost = () => {
  if (props.summaryData.totalShares > 0) {
    return props.summaryData.totalInvestment / props.summaryData.totalShares
  }
  return 0
}
</script>

<style scoped>
.investment-summary {
  width: 100%;
}

.chart-section {
  margin-top: 24px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  :deep(.n-grid) {
    --n-cols: 3;
  }
}

@media (max-width: 768px) {
  :deep(.n-grid) {
    --n-cols: 2;
  }
}

@media (max-width: 480px) {
  :deep(.n-grid) {
    --n-cols: 1;
  }
}
</style>