<template>
  <n-modal
    v-model:show="showModal"
    preset="dialog"
    title="编辑投资记录"
    :style="{ width: '800px' }"
    :mask-closable="false"
  >
    <div class="modal-content">
      <InvestmentForm
        ref="formRef"
        :model-value="formData"
        :is-edit="true"
        :investors="investors"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </n-modal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useMessage } from 'naive-ui'
import InvestmentForm from './InvestmentForm.vue'
import investmentService from '../services/InvestmentService'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  record: {
    type: Object,
    default: () => ({})
  },
  investors: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update:show', 'success'])

const message = useMessage()
const formRef = ref()

// 控制模态框显示
const showModal = ref(false)

// 表单数据
const formData = reactive({
  id: '',
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

// 方法
const handleSubmit = async (data) => {
  try {
    const result = investmentService.update(formData.id, data)
    
    if (result.success) {
      message.success('更新投资记录成功')
      handleClose()
      emit('success', result.data)
    } else {
      message.error('更新失败: ' + result.error)
    }
  } catch (error) {
    message.error('更新失败: ' + error.message)
  }
}

const handleCancel = () => {
  handleClose()
}

const handleClose = () => {
  showModal.value = false
}

const loadRecordData = (record) => {
  if (record && record.id) {
    Object.assign(formData, {
      id: record.id,
      investor: record.investor || '',
      stockCode: record.stockCode || '',
      stockName: record.stockName || '',
      holdingMethod: record.holdingMethod || '',
      investmentDate: record.investmentDate || null,
      investmentType: record.investmentType || '买入',
      quantity: record.quantity || null,
      currentShares: record.currentShares || null,
      unitPrice: record.unitPrice || null,
      currentPrice: record.currentPrice || null,
      totalAmount: record.totalAmount || 0,
      remarks: record.remarks || ''
    })
  }
}

// 监听show属性变化
watch(() => props.show, (newValue) => {
  showModal.value = newValue
  if (newValue && props.record) {
    loadRecordData(props.record)
  }
})

watch(showModal, (newValue) => {
  emit('update:show', newValue)
})

// 监听record变化
watch(() => props.record, (newRecord) => {
  if (newRecord && showModal.value) {
    loadRecordData(newRecord)
  }
}, { deep: true })
</script>

<style scoped>
.modal-content {
  padding: 0;
}

/* 确保模态框内容适应屏幕 */
@media (max-width: 900px) {
  :deep(.n-dialog) {
    width: 95vw !important;
    max-width: none !important;
  }
}
</style>