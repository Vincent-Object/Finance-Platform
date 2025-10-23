<template>
  <n-modal
    v-model:show="showModal"
    preset="dialog"
    title="添加投资记录"
    :style="{ width: '800px' }"
    :mask-closable="false"
  >
    <div class="modal-content">
      <InvestmentForm
        ref="formRef"
        :model-value="formData"
        :is-edit="false"
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
    const result = investmentService.add(data)
    
    if (result.success) {
      message.success('添加投资记录成功')
      handleClose()
      emit('success', result.data)
    } else {
      message.error('添加失败: ' + result.error)
    }
  } catch (error) {
    message.error('添加失败: ' + error.message)
  }
}

const handleCancel = () => {
  handleClose()
}

const handleClose = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  // 重置表单数据
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
  
  // 重置表单验证状态
  formRef.value?.resetForm()
}

// 监听show属性变化
watch(() => props.show, (newValue) => {
  showModal.value = newValue
})

watch(showModal, (newValue) => {
  emit('update:show', newValue)
})
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