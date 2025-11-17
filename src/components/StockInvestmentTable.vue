<template>
  <div class="stock-investment-table">
    <!-- 调试信息 -->
    <div v-if="data.length === 0" style="padding: 20px; text-align: center; color: #999;">
      暂无数据，请点击“重置模拟数据”按钮加载示例数据
    </div>
    <n-data-table
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="paginationProps"
      :row-key="rowKey"
      striped
      size="small"
      :scroll-x="tableWidth"
      :max-height="600"
      resizable
      class="data-table"
    />
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { NButton, NTag, NInputNumber, NPopconfirm, useMessage } from 'naive-ui'
import { Create, Trash } from '@vicons/ionicons5'
import dayjs from 'dayjs'

// Props
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  stockPrices: {
    type: Object,
    default: () => ({})
  },
  showColumns: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['edit', 'delete', 'update-current-price'])

const message = useMessage()

// 分页配置
const paginationProps = ref({
  page: 1,
  pageSize: 20,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  showQuickJumper: true,
  prefix: ({ itemCount }) => `共 ${itemCount} 条记录`
})

// 行key
const rowKey = (rowData) => rowData.id

// 计算表格总宽度
const tableWidth = computed(() => {
  // 计算所有列宽度的总和 - 使用 max(width, minWidth) 与 Naive UI 渲染逻辑一致
  const totalWidth = columns.value.reduce((sum, column) => {
    const actualWidth = Math.max(
      column.width || 0,
      column.minWidth || 0
    ) || 100
    return sum + actualWidth
  }, 0)
  return Math.max(totalWidth, 1200) // 确保最小宽度为1200px
})

// 格式化函数
const formatCurrency = (value) => {
  if (value == null) return '-'
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2
  }).format(value)
}

const formatNumber = (value) => {
  if (value == null) return '-'
  return new Intl.NumberFormat('zh-CN').format(value)
}

const formatPercent = (value) => {
  if (value == null) return '-'
  const formatted = value.toFixed(2) + '%'
  const color = value >= 0 ? '#52c41a' : '#ff4d4f'
  return h('span', { style: { color } }, formatted)
}

const formatDate = (value) => {
  if (!value) return '-'
  return dayjs(value).format('YYYY-MM-DD')
}

// 计算当前价值
const calculateCurrentValue = (record) => {
  const currentPrice = props.stockPrices[record.stockCode] || record.currentPrice || record.unitPrice
  return record.currentShares * currentPrice
}

// 计算未实现收益
const calculateUnrealizedGain = (record) => {
  const currentValue = calculateCurrentValue(record)
  const cost = record.currentShares * record.unitPrice
  return currentValue - cost
}

// 计算收益率
const calculateProfitRate = (record) => {
  const unrealizedGain = calculateUnrealizedGain(record)
  const cost = record.currentShares * record.unitPrice
  return cost > 0 ? (unrealizedGain / cost) * 100 : 0
}

// 当前价格输入组件
const PriceInput = (record) => {
  const currentPrice = ref(props.stockPrices[record.stockCode] || record.currentPrice || record.unitPrice)
  
  const handlePriceChange = (value) => {
    if (value && value > 0) {
      emit('update-current-price', record.stockCode, value)
    }
  }

  return h(NInputNumber, {
    value: currentPrice.value,
    precision: 2,
    min: 0.01,
    step: 0.01,
    size: 'small',
    style: { width: '100px' },
    onUpdateValue: handlePriceChange,
    onBlur: () => handlePriceChange(currentPrice.value)
  })
}

// 表格列配置
const columns = computed(() => [
  {
    title: '投资人',
    key: 'investor',
    width: 108,
    minWidth: 60,
    fixed: 'left',
    resizable: true,
    sorter: (a, b) => a.investor.localeCompare(b.investor),
    filterOptions: [
      ...new Set(props.data.map(item => item.investor))
    ].map(investor => ({
      label: investor,
      value: investor
    })),
    filter: (value, row) => row.investor === value
  },
  {
    title: '股票代码',
    key: 'stockCode',
    width: 108,
    minWidth: 80,
    fixed: 'left',
    resizable: true,
    sorter: (a, b) => a.stockCode.localeCompare(b.stockCode),
    render: (row) => h('span', { style: { fontFamily: 'monospace', fontWeight: 'bold' } }, row.stockCode)
  },
  {
    title: '股票名称',
    key: 'stockName',
    width: 108,
    minWidth: 120,
    fixed: 'left',
    resizable: true,
    sorter: (a, b) => a.stockName.localeCompare(b.stockName),
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '持有方式',
    key: 'holdingMethod',
    width: 108,
    minWidth: 80,
    resizable: true,
    sorter: (a, b) => a.holdingMethod.localeCompare(b.holdingMethod),
    render: (row) => {
      const type = row.holdingMethod === '拥有' ? 'success' : 'info'
      return h(NTag, { type, size: 'small' }, { default: () => row.holdingMethod })
    },
    filterOptions: [
      { label: '拥有', value: '拥有' },
      { label: '持有', value: '持有' }
    ],
    filter: (value, row) => row.holdingMethod === value
  },
  {
    title: '投资日期',
    key: 'investmentDate',
    width: 108,
    minWidth: 90,
    resizable: true,
    sorter: (a, b) => dayjs(a.investmentDate).unix() - dayjs(b.investmentDate).unix(),
    render: (row) => formatDate(row.investmentDate)
  },
  {
    title: '投资类型',
    key: 'investmentType',
    width: 108,
    minWidth: 70,
    resizable: true,
    render: (row) => {
      const type = row.investmentType === '买入' ? 'error' : 'success'
      return h(NTag, { type, size: 'small' }, { default: () => row.investmentType })
    },
    filterOptions: [
      { label: '买入', value: '买入' },
      { label: '卖出', value: '卖出' }
    ],
    filter: (value, row) => row.investmentType === value
  },
  {
    title: '投资数量',
    key: 'quantity',
    width: 108,
    minWidth: 80,
    resizable: true,
    align: 'right',
    sorter: (a, b) => a.quantity - b.quantity,
    render: (row) => formatNumber(row.quantity)
  },
  {
    title: '当前股数',
    key: 'currentShares',
    width: 108,
    minWidth: 80,
    resizable: true,
    align: 'right',
    sorter: (a, b) => a.currentShares - b.currentShares,
    render: (row) => formatNumber(row.currentShares)
  },
  {
    title: '买入单价',
    key: 'unitPrice',
    width: 108,
    minWidth: 90,
    resizable: true,
    align: 'right',
    sorter: (a, b) => a.unitPrice - b.unitPrice,
    render: (row) => formatCurrency(row.unitPrice)
  },
  {
    title: '当前价格',
    key: 'currentPrice',
    width: 108,
    minWidth: 100,
    resizable: true,
    align: 'right',
    render: (row) => PriceInput(row)
  },
  {
    title: '投资金额',
    key: 'totalAmount',
    width: 108,
    minWidth: 100,
    resizable: true,
    align: 'right',
    sorter: (a, b) => a.totalAmount - b.totalAmount,
    render: (row) => formatCurrency(row.totalAmount)
  },
  {
    title: '当前价值',
    key: 'currentValue',
    width: 108,
    minWidth: 100,
    resizable: true,
    align: 'right',
    sorter: (a, b) => calculateCurrentValue(a) - calculateCurrentValue(b),
    render: (row) => formatCurrency(calculateCurrentValue(row))
  },
  {
    title: '未实现收益',
    key: 'unrealizedGain',
    width: 108,
    minWidth: 110,
    resizable: true,
    align: 'right',
    sorter: (a, b) => calculateUnrealizedGain(a) - calculateUnrealizedGain(b),
    render: (row) => {
      const gain = calculateUnrealizedGain(row)
      const color = gain >= 0 ? '#52c41a' : '#ff4d4f'
      return h('span', { style: { color } }, formatCurrency(gain))
    }
  },
  {
    title: '收益率',
    key: 'profitRate',
    width: 108,
    minWidth: 70,
    resizable: true,
    align: 'right',
    sorter: (a, b) => calculateProfitRate(a) - calculateProfitRate(b),
    render: (row) => formatPercent(calculateProfitRate(row))
  },
  {
    title: '备注',
    key: 'remarks',
    width: 108,
    minWidth: 80,
    resizable: true,
    ellipsis: {
      tooltip: true
    },
    render: (row) => row.remarks || '-'
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    minWidth: 80,
    fixed: 'right',
    render: (row) => {
      return h('div', { style: { display: 'flex', gap: '4px', justifyContent: 'center' } }, [
        h(NButton, {
          size: 'small',
          type: 'primary',
          secondary: true,
          onClick: () => emit('edit', row)
        }, {
          icon: () => h(Create)
        }),
        h(NPopconfirm, {
          onPositiveClick: () => emit('delete', row)
        }, {
          trigger: () => h(NButton, {
            size: 'small',
            type: 'error',
            secondary: true
          }, {
            icon: () => h(Trash)
          }),
          default: () => '确定删除这条投资记录吗？'
        })
      ])
    }
  }
])
</script>

<style scoped>
.stock-investment-table {
  padding: 16px;
  position: relative;
  width: 100%;
  /* 移除外层overflow，让Naive UI内部处理滚动 */
}

/* 表格样式自定义 */
:deep(.n-data-table) {
  --n-th-color: #fafafa;
  --n-td-color-hover: #f5f5f5;
  border-radius: 6px;
  width: 100%;
  /* 不要设置overflow，让容器自己处理 */
}

/* 表格容器滚动优化 */
:deep(.n-data-table-container) {
  position: relative;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 100%;
}

/* 确保表格包装器正确滚动 */
:deep(.n-data-table-wrapper) {
  /* Naive UI会自动处理滚动 */
}

/* 列宽调整手柄样式 */
:deep(.n-data-table-resize-handle) {
  background-color: #d9d9d9;
  width: 2px;
  cursor: col-resize;
  transition: background-color 0.2s ease;
}

:deep(.n-data-table-resize-handle:hover) {
  background-color: #1890ff;
}

/* 列宽调整时的样式 */
:deep(.n-data-table-th--resizing) {
  user-select: none;
}





/* 表格基础表体 */
:deep(.n-data-table-base-table) {
  border-radius: 6px;
}

/* 表格内容区域滚动优化 */
:deep(.n-data-table-base-table-body) {
  scroll-behavior: smooth;
  /* 确保内容区域可以正确滚动 */
  position: relative;
}

/* 表格头部固定 */
:deep(.n-data-table-thead) {
  position: sticky;
  top: 0;
  z-index: 3;
  background: #fafafa;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.n-data-table-th) {
  font-weight: 600;
  background-color: #fafafa;
  white-space: nowrap;
  padding: 12px 8px;
  border-bottom: 1px solid #e8e8e8;
  position: relative;
  transition: background-color 0.2s ease;
}

:deep(.n-data-table-th:hover) {
  background-color: #f0f0f0;
}

:deep(.n-data-table-td) {
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 8px;
  white-space: nowrap;
}

/* 滚动条样式优化 - 确保滚动条在表格底部 */
:deep(.n-scrollbar) {
  /* 确保滚动条容器正确定位 */
  position: relative;
}

:deep(.n-scrollbar-rail--horizontal) {
  height: 12px;
  background-color: #f5f5f5;
  border-radius: 6px;
  /* 确保水平滚动条在表格内容区域底部 */
  bottom: 0;
}

:deep(.n-scrollbar-handle) {
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

:deep(.n-scrollbar-handle:hover) {
  background-color: rgba(0, 0, 0, 0.4);
}

/* 表格内容区域的滚动条位置调整 */
:deep(.n-data-table-wrapper) {
  position: relative;
  overflow-x: auto;
  overflow-y: auto;
}

/* 确保表格体滚动区域正确 */
:deep(.n-data-table-base-table-body-wrapper) {
  position: relative;
}

/* 固定列样式优化 */
:deep(.n-data-table-th[data-col-key="investor"]),
:deep(.n-data-table-td[data-col-key="investor"]) {
  position: sticky;
  left: 0;
  z-index: 3;
  background: #fafafa;
  border-right: 1px solid #e8e8e8;
}

:deep(.n-data-table-th[data-col-key="stockCode"]),
:deep(.n-data-table-td[data-col-key="stockCode"]) {
  position: sticky;
  left: 108px;
  z-index: 3;
  background: #fafafa;
  border-right: 1px solid #e8e8e8;
}

:deep(.n-data-table-th[data-col-key="stockName"]),
:deep(.n-data-table-td[data-col-key="stockName"]) {
  position: sticky;
  left: 216px;
  z-index: 3;
  background: #fafafa;
  border-right: 1px solid #e8e8e8;
}

/* 最后一个左固定列的阴影效果 */
:deep(.n-data-table-th[data-col-key="stockName"]::after),
:deep(.n-data-table-td[data-col-key="stockName"]::after) {
  content: '';
  position: absolute;
  top: 0;
  right: -6px;
  bottom: 0;
  width: 6px;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.1), transparent);
  pointer-events: none;
  z-index: 1;
}

/* 右固定操作列样式 */
:deep(.n-data-table .n-data-table-th:last-child),
:deep(.n-data-table .n-data-table-td:last-child) {
  position: sticky;
  right: 0;
  z-index: 10;
  background: #fafafa;
  border-left: 1px solid #e8e8e8;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.08);
  min-width: 100px;
  width: 100px;
}

/* 确保右固定列在滚动时保持在正确位置 */
:deep(.n-data-table-base-table) {
  min-width: v-bind(tableWidth + 'px');
}

:deep(.n-data-table-base-table-header),
:deep(.n-data-table-base-table-body) {
  min-width: v-bind(tableWidth + 'px');
}

/* 操作列左侧阴影 */
:deep(.n-data-table .n-data-table-th:last-child::before),
:deep(.n-data-table .n-data-table-td:last-child::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -6px;
  bottom: 0;
  width: 6px;
  background: linear-gradient(270deg, rgba(0, 0, 0, 0.1), transparent);
  pointer-events: none;
  z-index: 1;
}

/* 加载状态优化 */
:deep(.n-data-table-loading) {
  backdrop-filter: blur(2px);
  border-radius: 6px;
}

/* Empty 状态样式优化 */
:deep(.n-data-table-empty) {
  padding: 40px 20px;
  color: #999;
  text-align: center;
}

/* 分页器样式调整 */
:deep(.n-pagination) {
  margin-top: 16px;
  justify-content: center;
}

/* 响应式隐藏列 - 优化版本 */
@media (max-width: 1599px) {
  :deep(.n-data-table-th:nth-child(15)),
  :deep(.n-data-table-td:nth-child(15)) {
    display: none;
  }
}

@media (max-width: 1199px) {
  :deep(.n-data-table-th:nth-child(n+13)),
  :deep(.n-data-table-td:nth-child(n+13)) {
    display: none;
  }
  :deep(.n-data-table-th:nth-child(16)),
  :deep(.n-data-table-td:nth-child(16)) {
    display: table-cell;
  }
}

@media (max-width: 767px) {
  .stock-investment-table {
    padding: 8px;
  }
  
  :deep(.n-data-table-th:nth-child(n+8)),
  :deep(.n-data-table-td:nth-child(n+8)) {
    display: none;
  }
  :deep(.n-data-table-th:nth-child(16)),
  :deep(.n-data-table-td:nth-child(16)) {
    display: table-cell;
  }
}

/* 移动端表格适配 */
@media (max-width: 480px) {
  :deep(.n-data-table) {
    font-size: 12px;
  }
  
  :deep(.n-data-table-th),
  :deep(.n-data-table-td) {
    padding: 8px 4px;
  }
}

/* 表格行悬停效果 */
:deep(.n-data-table-tr:hover) {
  background-color: #f8f9fa;
}

/* 表格边框优化 */
:deep(.n-data-table-base-table) {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
}

/* 确保表格标题不换行 */
:deep(.n-data-table-th) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
