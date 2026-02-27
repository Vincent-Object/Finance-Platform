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

      <n-dropdown
        :options="userMenuOptions"
        @select="handleUserMenuSelect"
        placement="bottom-end"
      >
        <div class="user-avatar" :style="{ background: avatarColor }">
          {{ avatarText }}
        </div>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRoute } from 'vue-router'
import { Menu } from '@vicons/ionicons5'

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

const emit = defineEmits(['navigate', 'logout'])

const route = useRoute()

const getUsername = () => {
  try {
    const raw = localStorage.getItem('authData') || sessionStorage.getItem('authData')
    if (raw) {
      const data = JSON.parse(raw)
      return data.username || ''
    }
  } catch (e) { /* ignore */ }
  return ''
}

const username = computed(() => getUsername())

const avatarText = computed(() => {
  const name = username.value
  return name ? name.charAt(0).toUpperCase() : '?'
})

const avatarColor = computed(() => {
  const name = username.value
  if (!name) return '#8b5cf6'
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#3b82f6', '#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444']
  return colors[Math.abs(hash) % colors.length]
})

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

const userMenuOptions = ref([
  {
    label: '个人中心',
    key: 'Profile',
    icon: () => h('span', '👤')
  },
  { type: 'divider' },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h('span', '🚪')
  }
])

const handleMenuSelect = (key) => {
  if (key !== route.name) {
    emit('navigate', key)
  }
}

const handleUserMenuSelect = (key) => {
  if (key === 'logout') {
    localStorage.removeItem('authData')
    sessionStorage.removeItem('authData')
    emit('logout')
  } else if (key !== route.name) {
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

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.user-avatar:hover {
  transform: scale(1.08);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
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