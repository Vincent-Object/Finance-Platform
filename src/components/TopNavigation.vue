<template>
  <div class="top-navigation">
    <!-- 左侧标题区域 -->
    <div class="page-title-section">
      <h1 class="page-title">{{ title }}</h1>
      <span class="page-description">{{ description }}</span>
    </div>
    
    <!-- 右侧菜单区域 -->
    <div class="navigation-menu">
      <n-dropdown 
        :options="menuOptions" 
        @select="handleMenuSelect"
        placement="bottom-end"
      >
        <n-button text size="large">
          <template #icon>
            <n-icon><Menu /></n-icon>
          </template>
          导航菜单
        </n-button>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { useRoute } from 'vue-router'
import { Menu } from '@vicons/ionicons5'

// Props
const props = defineProps({
  title: {
    type: String,
    default: '投资管理平台'
  },
  description: {
    type: String,
    default: '金融投资管理系统'
  }
})

// Emits
const emit = defineEmits(['navigate'])

const route = useRoute()

// 菜单选项
const menuOptions = ref([
  {
    label: '投资看板',
    key: 'InvestmentDashboard',
    icon: () => h('span', '📊'),
    disabled: false
  },
  {
    label: '股票投资',
    key: 'StockInvestments', 
    icon: () => h('span', '📈'),
    disabled: false
  }
])

// 处理菜单选择
const handleMenuSelect = (key) => {
  if (key !== route.name) {
    emit('navigate', key)
  }
}
</script>

<style scoped>
.top-navigation {
  height: 64px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  position: relative;
  z-index: 100;
}

.page-title-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
}

.page-description {
  font-size: 14px;
  color: #666;
  margin-top: 2px;
}

.navigation-menu {
  display: flex;
  align-items: center;
  gap: 16px;
}

.navigation-menu .n-button {
  color: #666;
  font-size: 16px;
  font-weight: 500;
}

.navigation-menu .n-button:hover {
  color: #1890ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-navigation {
    padding: 0 16px;
  }
  
  .page-title {
    font-size: 18px;
  }
  
  .page-description {
    font-size: 12px;
  }
  
  .navigation-menu .n-button {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .top-navigation {
    padding: 0 12px;
  }
  
  .page-title-section {
    max-width: 60%;
  }
  
  .page-title {
    font-size: 16px;
  }
  
  .page-description {
    display: none;
  }
}
</style>