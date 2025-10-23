<template>
  <n-card class="summary-card" :bordered="false" :style="cardStyle">
    <div class="card-content">
      <div class="card-header">
        <div class="icon" :style="{ backgroundColor: color + '20', color: color }">
          {{ icon }}
        </div>
        <div class="title">{{ title }}</div>
      </div>
      
      <div class="card-body">
        <div class="main-value" :style="{ color: color }">
          <n-skeleton v-if="loading" text style="width: 60%" />
          <span v-else>{{ value }}</span>
        </div>
        
        <div v-if="subValue" class="sub-value">
          <n-skeleton v-if="loading" text style="width: 40%" />
          <span v-else>{{ subValue }}</span>
        </div>
      </div>
    </div>
    
    <!-- 装饰性背景图案 -->
    <div class="card-decoration" :style="{ backgroundColor: color + '10' }"></div>
  </n-card>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  subValue: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#1890ff'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// 计算卡片样式
const cardStyle = computed(() => ({
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  cursor: 'default'
}))
</script>

<style scoped>
.summary-card {
  height: 120px;
  position: relative;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important;
}

.card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}

.title {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.main-value {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 4px;
}

.sub-value {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.card-decoration {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  z-index: 1;
  opacity: 0.3;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .summary-card {
    height: 100px;
  }
  
  .icon {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  
  .title {
    font-size: 12px;
  }
  
  .main-value {
    font-size: 18px;
  }
  
  .sub-value {
    font-size: 10px;
  }
  
  .card-decoration {
    width: 60px;
    height: 60px;
    top: -15px;
    right: -15px;
  }
}
</style>