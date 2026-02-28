import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import LoginPage from './components/LoginPage.vue'
import './styles/theme.css'
import StockInvestmentPage from './views/StockInvestmentPage.vue'
import InvestmentDashboard from './views/InvestmentDashboard.vue'
import ProfilePage from './views/ProfilePage.vue'
import { 
  NButton, NInput, NCheckbox, NForm, NFormItem, NFormItemGi, NMessageProvider, NCard, NH1, NP, NText,
  NDataTable, NTag, NInputNumber, NPopconfirm, NModal, NSelect, NAutoComplete, NDatePicker,
  NGrid, NGridItem, NSkeleton, NIcon, NDropdown, NEmpty, NConfigProvider, NSwitch, NDivider,
  createDiscreteApi 
} from 'naive-ui'

// 创建路由配置
const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/dashboard',
    name: 'InvestmentDashboard',
    component: InvestmentDashboard,
    meta: {
      title: '投资看板',
      requiresAuth: true
    }
  },
  {
    path: '/investments',
    name: 'StockInvestments',
    component: StockInvestmentPage,
    meta: {
      title: '股票投资记录',
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: {
      title: '个人中心',
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 认证状态检查函数
const checkAuthStatus = () => {
  // 检查 localStorage 和 sessionStorage 中的认证数据
  const localAuth = localStorage.getItem('authData')
  const sessionAuth = sessionStorage.getItem('authData')
  
  if (localAuth) {
    try {
      const authData = JSON.parse(localAuth)
      return authData.isAuthenticated === true
    } catch (error) {
      console.error('解析localStorage认证数据失败:', error)
      localStorage.removeItem('authData')
      return false
    }
  }
  
  if (sessionAuth) {
    try {
      const authData = JSON.parse(sessionAuth)
      return authData.isAuthenticated === true
    } catch (error) {
      console.error('解析sessionStorage认证数据失败:', error)
      sessionStorage.removeItem('authData')
      return false
    }
  }
  
  return false
}

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 检查目标路由是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth) {
    // 检查用户是否已认证
    const isAuthenticated = checkAuthStatus()
    
    if (isAuthenticated) {
      // 已认证，允许访问
      next()
    } else {
      // 未认证，重定向到登录页
      console.log('用户未认证，重定向到登录页')
      next({ path: '/login', query: { redirect: to.fullPath } })
    }
  } else {
    // 不需要认证的路由，直接允许访问
    next()
  }

  // 登录后默认重定向到投资看板
  if (to.path === '/investments' && from.path === '/login') {
    next({ name: 'InvestmentDashboard' })
    return
  }

  // 如果访问根路径且已认证，重定向到投资看板
  if (to.path === '/' && checkAuthStatus()) {
    next({ name: 'InvestmentDashboard' })
    return
  }
})

const app = createApp(App)
app.use(router)

// 创建消息API
const { message } = createDiscreteApi(['message'])

// 注册Naive UI组件
app.provide('message', message)
app.component('NButton', NButton)
app.component('NInput', NInput)
app.component('NCheckbox', NCheckbox)
app.component('NForm', NForm)
app.component('NFormItem', NFormItem)
app.component('NFormItemGi', NFormItemGi)
app.component('NMessageProvider', NMessageProvider)
app.component('NCard', NCard)
app.component('NH1', NH1)
app.component('NP', NP)
app.component('NText', NText)
app.component('NDataTable', NDataTable)
app.component('NTag', NTag)
app.component('NInputNumber', NInputNumber)
app.component('NPopconfirm', NPopconfirm)
app.component('NModal', NModal)
app.component('NSelect', NSelect)
app.component('NAutoComplete', NAutoComplete)
app.component('NDatePicker', NDatePicker)
app.component('NGrid', NGrid)
app.component('NGridItem', NGridItem)
app.component('NSkeleton', NSkeleton)
app.component('NIcon', NIcon)
app.component('NDropdown', NDropdown)
app.component('NEmpty', NEmpty)
app.component('NConfigProvider', NConfigProvider)
app.component('NSwitch', NSwitch)
app.component('NDivider', NDivider)

app.mount('#app')