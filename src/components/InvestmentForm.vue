<template>
  <n-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-placement="left"
    label-width="120px"
    require-mark-placement="right-hanging"
  >
    <n-grid :cols="2" :x-gap="24">
      <!-- 投资人 -->
      <n-form-item-gi label="投资人" path="investor">
        <n-auto-complete
          v-model:value="formData.investor"
          :options="investorOptions"
          placeholder="请输入或选择投资人"
          clearable
        />
      </n-form-item-gi>

      <!-- 股票代码 -->
      <n-form-item-gi label="股票代码" path="stockCode">
        <n-input
          v-model:value="formData.stockCode"
          placeholder="请输入6位股票代码"
          maxlength="6"
          clearable
          @blur="handleStockCodeBlur"
        />
      </n-form-item-gi>

      <!-- 股票名称 -->
      <n-form-item-gi label="股票名称" path="stockName">
        <n-input
          v-model:value="formData.stockName"
          placeholder="请输入股票名称"
          clearable
        />
      </n-form-item-gi>

      <!-- 持有方式 -->
      <n-form-item-gi label="持有方式" path="holdingMethod">
        <n-select
          v-model:value="formData.holdingMethod"
          :options="holdingMethodOptions"
          placeholder="请选择持有方式"
        />
      </n-form-item-gi>

      <!-- 投资日期 -->
      <n-form-item-gi label="投资日期" path="investmentDate">
        <n-date-picker
          v-model:value="formData.investmentDate"
          type="date"
          placeholder="请选择投资日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          clearable
          style="width: 100%"
        />
      </n-form-item-gi>

      <!-- 投资类型 -->
      <n-form-item-gi label="投资类型" path="investmentType">
        <n-select
          v-model:value="formData.investmentType"
          :options="investmentTypeOptions"
          placeholder="请选择投资类型"
        />
      </n-form-item-gi>

      <!-- 投资数量 -->
      <n-form-item-gi label="投资数量(股)" path="quantity">
        <n-input-number
          v-model:value="formData.quantity"
          placeholder="请输入投资数量"
          :min="100"
          :max="1000000"
          :step="100"
          style="width: 100%"
          @update:value="handleQuantityChange"
        />
      </n-form-item-gi>

      <!-- 当前股数 -->
      <n-form-item-gi label="当前股数" path="currentShares">
        <n-input-number
          v-model:value="formData.currentShares"
          placeholder="请输入当前持有股数"
          :min="0"
          :max="formData.quantity || 1000000"
          style="width: 100%"
          @update:value="handleCurrentSharesChange"
        />
      </n-form-item-gi>

      <!-- 买入单价 -->
      <n-form-item-gi label="买入单价(元)" path="unitPrice">
        <n-input-number
          v-model:value="formData.unitPrice"
          placeholder="请输入买入单价"
          :min="0.01"
          :precision="2"
          :step="0.01"
          style="width: 100%"
          @update:value="calculateTotalAmount"
        />
      </n-form-item-gi>

      <!-- 当前价格 -->
      <n-form-item-gi label="当前价格(元)" path="currentPrice">
        <n-input-number
          v-model:value="formData.currentPrice"
          placeholder="请输入当前市价（可选）"
          :min="0.01"
          :precision="2"
          :step="0.01"
          style="width: 100%"
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <!-- 总投资金额（只读显示） -->
    <n-form-item label="总投资金额(元)" path="totalAmount">
      <n-input
        :value="formatCurrency(formData.totalAmount)"
        readonly
        placeholder="根据数量和单价自动计算"
      />
    </n-form-item>

    <!-- 备注 -->
    <n-form-item label="备注" path="remarks">
      <n-input
        v-model:value="formData.remarks"
        type="textarea"
        placeholder="请输入备注信息（可选）"
        :rows="3"
        maxlength="200"
        show-count
        clearable
      />
    </n-form-item>

    <!-- 表单按钮 -->
    <div class="form-actions">
      <n-button @click="handleCancel">
        取消
      </n-button>
      <n-button 
        type="primary" 
        :loading="submitting"
        @click="handleSubmit"
      >
        {{ isEdit ? '更新' : '添加' }}
      </n-button>
    </div>
  </n-form>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useMessage } from 'naive-ui'
import dayjs from 'dayjs'
import investmentService from '../services/InvestmentService'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  investors: {
    type: Array,
    default: () => []
  },
  stockCodes: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const message = useMessage()
const formRef = ref()
const submitting = ref(false)

// 表单数据
const formData = reactive({
  investor: '',
  stockCode: '',
  stockName: '',
  holdingMethod: '',
  investmentDate: null,
  investmentType: '买入',
  quantity: null,
  currentShares: null,
  unitPrice: null,
  currentPrice: null,
  totalAmount: 0,
  remarks: ''
})

// 选项数据
const holdingMethodOptions = [
  { label: '拥有', value: '拥有' },
  { label: '持有', value: '持有' }
]

const investmentTypeOptions = [
  { label: '买入', value: '买入' },
  { label: '卖出', value: '卖出' }
]

const investorOptions = computed(() => {
  return props.investors.map(investor => ({
    label: investor,
    value: investor
  }))
})

// 表单验证规则
const rules = {
  investor: [
    { required: true, message: '请输入投资人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '投资人姓名长度应为2-20个字符', trigger: 'blur' }
  ],
  stockCode: [
    { required: true, message: '请输入股票代码', trigger: 'blur' },
    { pattern: /^[0-9A-Za-z]{6}$/, message: '股票代码必须为6位数字或字母组合', trigger: 'blur' }
  ],
  stockName: [
    { required: true, message: '请输入股票名称', trigger: 'blur' },
    { min: 2, max: 20, message: '股票名称长度应为2-20个字符', trigger: 'blur' }
  ],
  holdingMethod: [
    { required: true, message: '请选择持有方式', trigger: 'change' }
  ],
  investmentDate: [
    { required: true, message: '请选择投资日期', trigger: 'change' },
    {
      validator: (rule, value) => {
        if (value && dayjs(value).isAfter(dayjs())) {
          return Promise.reject('投资日期不能超过当前日期')
        }
        return Promise.resolve()
      },
      trigger: 'change'
    }
  ],
  investmentType: [
    { required: true, message: '请选择投资类型', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '请输入投资数量', trigger: 'blur' },
    { type: 'number', min: 100, message: '投资数量不能少于100股', trigger: 'blur' },
    {
      validator: (rule, value) => {
        if (value && value % 100 !== 0) {
          return Promise.reject('投资数量必须是100的整数倍')
        }
        return Promise.resolve()
      },
      trigger: 'blur'
    }
  ],
  currentShares: [
    { required: true, message: '请输入当前股数', trigger: 'blur' },
    { type: 'number', min: 0, message: '当前股数不能为负数', trigger: 'blur' },
    {
      validator: (rule, value) => {
        if (value > formData.quantity) {
          return Promise.reject('当前股数不能超过投资数量')
        }
        return Promise.resolve()
      },
      trigger: 'blur'
    }
  ],
  unitPrice: [
    { required: true, message: '请输入买入单价', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '买入单价必须大于0.01', trigger: 'blur' }
  ]
}

// 方法
const formatCurrency = (value) => {
  if (value == null || value === 0) return '¥0.00'
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2
  }).format(value)
}

const calculateTotalAmount = () => {
  if (formData.quantity && formData.unitPrice) {
    formData.totalAmount = formData.quantity * formData.unitPrice
  } else {
    formData.totalAmount = 0
  }
}

const handleQuantityChange = (value) => {
  // 当投资数量改变时，如果当前股数为空或大于投资数量，则设置为投资数量
  if (value && (!formData.currentShares || formData.currentShares > value)) {
    formData.currentShares = value
  }
  calculateTotalAmount()
}

const handleCurrentSharesChange = (value) => {
  // 根据当前股数自动设置持有方式
  if (value !== null && formData.quantity) {
    if (value === formData.quantity) {
      formData.holdingMethod = '拥有'
    } else if (value > 0 && value < formData.quantity) {
      formData.holdingMethod = '持有'
    }
  }
}

const handleStockCodeBlur = () => {
  // 这里可以添加根据股票代码自动填充股票名称的逻辑
  // 在实际项目中可能需要调用API获取股票信息
  if (formData.stockCode && !formData.stockName) {
    // 示例：一些常见股票的映射
    const stockMap = {
      '000001': '平安银行',
      '000002': '万科A',
      '000858': '五粮液',
      '600036': '招商银行',
      '600519': '贵州茅台',
      '000650': '仁和药业'
    }
    
    if (stockMap[formData.stockCode]) {
      formData.stockName = stockMap[formData.stockCode]
    }
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true
    
    const submitData = { ...formData }
    
    // 确保日期格式正确
    if (submitData.investmentDate) {
      submitData.investmentDate = dayjs(submitData.investmentDate).format('YYYY-MM-DD')
    }
    
    emit('submit', submitData)
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

const resetForm = () => {
  Object.assign(formData, {
    investor: '',
    stockCode: '',
    stockName: '',
    holdingMethod: '',
    investmentDate: null,
    investmentType: '买入',
    quantity: null,
    currentShares: null,
    unitPrice: null,
    currentPrice: null,
    totalAmount: 0,
    remarks: ''
  })
  formRef.value?.restoreValidation()
}

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  if (newValue && Object.keys(newValue).length > 0) {
    Object.assign(formData, newValue)
    calculateTotalAmount()
  }
}, { immediate: true, deep: true })

// 监听投资数量和单价变化
watch([() => formData.quantity, () => formData.unitPrice], () => {
  calculateTotalAmount()
})

// 暴露方法给父组件
defineExpose({
  resetForm,
  validate: () => formRef.value?.validate()
})
</script>

<style scoped>
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

/* 响应式布局 */
@media (max-width: 768px) {
  :deep(.n-grid) {
    --n-cols: 1 !important;
  }
  
  .form-actions {
    justify-content: center;
  }
}
</style>