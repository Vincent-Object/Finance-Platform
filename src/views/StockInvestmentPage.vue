<template>
  <div class="stock-investment-page">

    <!-- 操作工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <!-- 投资人筛选 -->
        <n-select
          v-model:value="filters.investor"
          :options="investorOptions"
          placeholder="选择投资人"
          clearable
          style="width: 150px"
        />
        
        <!-- 持有方式筛选 -->
        <n-select
          v-model:value="filters.holdingMethod"
          :options="holdingMethodOptions"
          placeholder="持有方式"
          clearable
          style="width: 120px"
        />
        
        <!-- 搜索框 -->
        <n-input
          v-model:value="filters.search"
          placeholder="搜索股票代码或名称"
          clearable
          style="width: 200px"
        >
          <template #prefix>
            <n-icon :component="Search" />
          </template>
        </n-input>
      </div>
      
      <div class="toolbar-right">
        <!-- 添加记录按钮 -->
        <n-button 
          type="primary" 
          @click="showAddModal = true"
        >
          <template #icon>
            <n-icon :component="Add" />
          </template>
          添加记录
        </n-button>
        
        <!-- 导出数据按钮 -->
        <n-dropdown 
          :options="exportOptions" 
          @select="handleExport"
        >
          <n-button>
            <template #icon>
              <n-icon :component="Download" />
            </template>
            导出数据
          </n-button>
        </n-dropdown>
        
        <!-- 临时调试按钮 -->
        <n-button 
          type="warning" 
          @click="handleResetMockData"
        >
          重置模拟数据
        </n-button>
      </div>
    </div>

    <!-- 投资记录表格 -->
    <StockInvestmentTable
      :data="filteredList"
      :loading="loading"
      :stock-prices="stockPrices"
      @edit="handleEdit"
      @delete="handleDelete"
      @update-current-price="handleUpdateCurrentPrice"
      class="investment-table"
    />

    <!-- 添加投资记录模态框 -->
    <AddInvestmentModal
      v-model:show="showAddModal"
      :investors="investors"
      @success="handleAddSuccess"
    />

    <!-- 编辑投资记录模态框 -->
    <EditInvestmentModal
      v-model:show="showEditModal"
      :record="selectedRecord"
      :investors="investors"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, h } from 'vue'
import { useMessage } from 'naive-ui'
import { Search, Add, Download } from '@vicons/ionicons5'
import investmentService from '../services/InvestmentService'

import StockInvestmentTable from '../components/StockInvestmentTable.vue'
import AddInvestmentModal from '../components/AddInvestmentModal.vue'
import EditInvestmentModal from '../components/EditInvestmentModal.vue'

// 组合式API
const message = useMessage()

// 响应式数据
const loading = ref(false)
const investmentList = ref([])
const investors = ref([])
const stockPrices = ref({})
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedRecord = ref(null)

// 筛选条件
const filters = reactive({
  investor: null,
  holdingMethod: null,
  search: '',
  startDate: null,
  endDate: null
})

// 计算属性
const filteredList = computed(() => {
  if (!investmentList.value || investmentList.value.length === 0) {
    return []
  }
  
  let filtered = [...investmentList.value]
  
  // 按投资人筛选
  if (filters.investor) {
    filtered = filtered.filter(record => 
      record.investor.includes(filters.investor)
    )
  }

  // 按持有方式筛选
  if (filters.holdingMethod) {
    filtered = filtered.filter(record => 
      record.holdingMethod === filters.holdingMethod
    )
  }

  // 搜索关键词
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filtered = filtered.filter(record => 
      record.stockName.toLowerCase().includes(searchTerm) ||
      record.stockCode.toLowerCase().includes(searchTerm) ||
      record.investor.toLowerCase().includes(searchTerm)
    )
  }

  return filtered
})



const investorOptions = computed(() => {
  return investors.value.map(investor => ({
    label: investor,
    value: investor
  }))
})

const holdingMethodOptions = [
  { label: '拥有', value: '拥有' },
  { label: '持有', value: '持有' }
]

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
    investmentList.value = investmentService.getAll()
    investors.value = investmentService.getInvestors()
    
    console.log('加载数据结果:', {
      investmentCount: investmentList.value.length,
      investors: investors.value,
      sampleRecord: investmentList.value[0]
    })
    
    // 加载股票价格缓存
    const uniqueStockCodes = [...new Set(investmentList.value.map(record => record.stockCode))]
    uniqueStockCodes.forEach(stockCode => {
      const price = investmentService.getStockPrice(stockCode)
      if (price) {
        stockPrices.value[stockCode] = price
      }
    })
  } catch (error) {
    console.error('加载数据失败:', error)
    message.error('加载数据失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

const handleEdit = (record) => {
  selectedRecord.value = { ...record }
  showEditModal.value = true
}

const handleDelete = async (record) => {
  const result = investmentService.delete(record.id)
  if (result.success) {
    message.success('删除成功')
    await loadData()
  } else {
    message.error('删除失败: ' + result.error)
  }
}

const handleAddSuccess = async () => {
  message.success('添加成功')
  await loadData()
}

const handleEditSuccess = async () => {
  message.success('更新成功')
  await loadData()
}

const handleUpdateCurrentPrice = async (stockCode, price) => {
  const result = investmentService.updateStockPrice(stockCode, price)
  if (result.success) {
    stockPrices.value[stockCode] = price
    message.success('价格更新成功')
  } else {
    message.error('价格更新失败: ' + result.error)
  }
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
    a.download = `投资记录_${new Date().toISOString().split('T')[0]}.${key}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    message.success('导出成功')
  } catch (error) {
    message.error('导出失败: ' + error.message)
  }
}

// 临时调试方法：重置为模拟数据
const handleResetMockData = async () => {
  try {
    const result = investmentService.resetToMockData()
    if (result.success) {
      message.success(result.message)
      await loadData() // 重新加载数据
    } else {
      message.error('重置失败: ' + result.error)
    }
  } catch (error) {
    message.error('重置失败: ' + error.message)
  }
}

// 监听筛选条件变化
watch(filters, () => {
  // 筛选条件变化时自动更新数据
}, { deep: true })

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.stock-investment-page {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
}



.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.toolbar-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.investment-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stock-investment-page {
    padding: 12px;
  }
  
  .toolbar {
    flex-direction: column;
    gap: 12px;
  }
  
  .toolbar-left,
  .toolbar-right {
    width: 100%;
    justify-content: center;
  }
  
  .toolbar-left {
    flex-wrap: wrap;
  }
}
</style>