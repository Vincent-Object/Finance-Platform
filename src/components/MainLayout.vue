<template>
  <div class="main-layout">
    <!-- 顶部导航栏 -->
    <TopNavigation 
      :title="currentPageTitle"
      :description="currentPageDescription"
      @navigate="handleNavigation"
      @logout="handleLogout"
    />
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopNavigation from './TopNavigation.vue'

const route = useRoute()
const router = useRouter()

// 计算当前页面标题和描述
const currentPageTitle = computed(() => {
  const routeMap = {
    'InvestmentDashboard': '投资看板',
    'StockInvestments': '股票投资',
    'Profile': '个人中心'
  }
  return routeMap[route.name] || '投资管理平台'
})

const currentPageDescription = computed(() => {
  const descriptionMap = {
    'InvestmentDashboard': '查看投资组合统计和收益分析',
    'StockInvestments': '管理您的股票投资组合，追踪投资收益',
    'Profile': '管理您的个人资料和投资偏好'
  }
  return descriptionMap[route.name] || '金融投资管理系统'
})

const handleNavigation = (routeName) => {
  router.push({ name: routeName })
}

const handleLogout = () => {
  router.push('/login')
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.main-content {
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
}
</style>