<template>
  <div class="investment-dashboard">
    <!-- 投资统计卡片区域 -->
    <div class="dashboard-section">
      <InvestmentSummary 
        :summary-data="summaryData" 
        :loading="loading"
        :show-chart="true"
        class="summary-section"
      />
    </div>

    <!-- 图表分析区域 -->
    <div class="dashboard-section">
      <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen">
        <!-- 收益趋势图 -->
        <n-grid-item span="1">
          <n-card title="收益趋势分析" :bordered="false" class="chart-card">
            <div class="chart-container">
              <n-empty description="收益趋势图表开发中..." />
            </div>
          </n-card>
        </n-grid-item>

        <!-- 资产分布图 -->
        <n-grid-item span="1">
          <n-card title="资产分布分析" :bordered="false" class="chart-card">
            <div class="chart-container">
              <n-empty description="资产分布图表开发中..." />
            </div>
          </n-card>
        </n-grid-item>

        <!-- 投资人分析图 -->
        <n-grid-item span="1">
          <n-card title="投资人收益对比" :bordered="false" class="chart-card">
            <div class="chart-container">
              <n-empty description="投资人分析图表开发中..." />
            </div>
          </n-card>
        </n-grid-item>

        <!-- 股票表现排行 -->
        <n-grid-item span="1">
          <n-card title="股票表现排行" :bordered="false" class="chart-card">
            <div class="chart-container">
              <n-empty description="股票排行图表开发中..." />
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>

    <!-- 快速操作区域 -->
    <div class="dashboard-section">
      <n-card title="快速操作" :bordered="false" class="action-card">
        <div class="quick-actions">
          <n-button 
            type="primary" 
            size="large"
            @click="navigateToInvestments"
          >
            <template #icon>
              <n-icon><Add /></n-icon>
            </template>
            添加投资记录
          </n-button>
          
          <n-button 
            size="large"
            @click="refreshData"
            :loading="loading"
          >
            <template #icon>
              <n-icon><Refresh /></n-icon>
            </template>
            刷新数据
          </n-button>

          <n-dropdown 
            :options="exportOptions" 
            @select="handleExport"
          >
            <n-button size="large">
              <template #icon>
                <n-icon><Download /></n-icon>
              </template>
              导出数据
            </n-button>
          </n-dropdown>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { Add, Refresh, Download } from '@vicons/ionicons5'
import investmentService from '../services/InvestmentService'
import InvestmentSummary from '../components/InvestmentSummary.vue'

// 组合式API
const router = useRouter()
const message = useMessage()

// 响应式数据
const loading = ref(false)

// 筛选条件（可以通过查询参数传递）
const filters = reactive({
  investor: null,
  holdingMethod: null,
  search: '',
  startDate: null,
  endDate: null
})

// 计算属性
const summaryData = computed(() => {
  return investmentService.calculateSummary(filters.investor)
})

// 导出选项
const exportOptions = [
  {
    label: 'JSON格式',
    key: 'json',
    icon: () => h('span', '📄')
  },
  {
    label: 'CSV格式',
    key: 'csv',
    icon: () => h('span', '📊')
  }
]

// 方法
const loadData = async () => {
  loading.value = true
  try {
    // 刷新数据
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟异步操作
    message.success('数据刷新成功')
  } catch (error) {
    message.error('数据刷新失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadData()
}

const navigateToInvestments = () => {
  router.push({ name: 'StockInvestments' })
}

const handleExport = (key) => {
  try {
    const data = investmentService.export(key)
    const blob = new Blob([data], { 
      type: key === 'json' ? 'application/json' : 'text/csv' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `投资数据_${new Date().toISOString().split('T')[0]}.${key}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    message.success('导出成功')
  } catch (error) {
    message.error('导出失败: ' + error.message)
  }
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.investment-dashboard {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
}

.dashboard-section {
  margin-bottom: 24px;
}

.summary-section {
  width: 100%;
}

.chart-card {
  height: 400px;
}

.chart-container {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  border-radius: 6px;
}

.action-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quick-actions {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  :deep(.n-grid) {
    --n-cols: 1;
  }
}

@media (max-width: 768px) {
  .investment-dashboard {
    padding: 16px;
  }
  
  .chart-card {
    height: 300px;
  }
  
  .chart-container {
    height: 220px;
  }
  
  .quick-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .investment-dashboard {
    padding: 12px;
  }
  
  .quick-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .quick-actions .n-button {
    width: 100%;
  }
}
</style>