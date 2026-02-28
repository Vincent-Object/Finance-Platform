<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <!-- 头部 -->
      <header class="welcome-header">
        <div class="logo-section">
          <div class="logo-icon">💼</div>
          <h1 class="platform-name">金融平台</h1>
          <p class="platform-subtitle">Finance Platform</p>
        </div>
      </header>

      <!-- 主要内容 -->
      <main class="welcome-main">
        <div class="hero-section">
          <h2 class="hero-title">智能投资管理，尽在掌握</h2>
          <p class="hero-description">
            专业的金融投资管理工具，帮助您轻松追踪和管理投资组合
          </p>
          
          <div class="cta-buttons">
            <n-button 
              type="primary" 
              size="large" 
              @click="goToLogin"
              class="primary-button"
            >
              开始使用
            </n-button>
            <n-button 
              size="large" 
              quaternary
              @click="scrollToFeatures"
              class="secondary-button"
            >
              了解更多
            </n-button>
          </div>
        </div>

        <!-- 特性展示 -->
        <div class="features-section" ref="featuresRef">
          <h3 class="section-title">核心功能</h3>
          
          <div class="features-grid">
            <n-card 
              v-for="feature in features" 
              :key="feature.id"
              class="feature-card"
              hoverable
            >
              <div class="feature-icon">{{ feature.icon }}</div>
              <h4 class="feature-title">{{ feature.title }}</h4>
              <p class="feature-description">{{ feature.description }}</p>
            </n-card>
          </div>
        </div>

        <!-- 统计数据展示 -->
        <div class="stats-section">
          <div class="stats-grid">
            <div 
              v-for="stat in stats" 
              :key="stat.label"
              class="stat-item"
            >
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </main>

      <!-- 底部 -->
      <footer class="welcome-footer">
        <p class="footer-text">© 2026 金融平台. 专业的投资管理工具</p>
        <div class="footer-links">
          <n-button text class="footer-link">关于我们</n-button>
          <n-divider vertical />
          <n-button text class="footer-link">隐私政策</n-button>
          <n-divider vertical />
          <n-button text class="footer-link">使用条款</n-button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'WelcomePage',
  setup() {
    const router = useRouter()
    const featuresRef = ref(null)

    const features = [
      {
        id: 1,
        icon: '📊',
        title: '投资看板',
        description: '实时查看投资组合表现，直观的数据可视化让您一目了然'
      },
      {
        id: 2,
        icon: '📈',
        title: '股票管理',
        description: '轻松记录和管理股票投资，追踪每笔交易的盈亏情况'
      },
      {
        id: 3,
        icon: '💰',
        title: '收益分析',
        description: '全面分析投资收益，帮助您做出更明智的投资决策'
      },
      {
        id: 4,
        icon: '🔒',
        title: '安全保障',
        description: '银行级安全加密，保护您的个人信息和投资数据'
      },
      {
        id: 5,
        icon: '📱',
        title: '多端同步',
        description: '支持多设备访问，随时随地管理您的投资组合'
      },
      {
        id: 6,
        icon: '🎨',
        title: '主题定制',
        description: '支持深色/浅色主题切换，打造个性化使用体验'
      }
    ]

    const stats = [
      { value: '10,000+', label: '活跃用户' },
      { value: '¥50亿+', label: '管理资产' },
      { value: '99.9%', label: '系统稳定性' },
      { value: '24/7', label: '技术支持' }
    ]

    const goToLogin = () => {
      router.push('/login')
    }

    const scrollToFeatures = () => {
      if (featuresRef.value) {
        featuresRef.value.scrollIntoView({ behavior: 'smooth' })
      }
    }

    return {
      features,
      stats,
      featuresRef,
      goToLogin,
      scrollToFeatures
    }
  }
}
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow-x: hidden;
  padding: 20px;
}

.dark-theme .welcome-container {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.welcome-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* 头部样式 */
.welcome-header {
  padding: 40px 0;
  text-align: center;
}

.logo-section {
  display: inline-block;
}

.logo-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.platform-name {
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.platform-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 500;
  letter-spacing: 2px;
}

/* 主要内容 */
.welcome-main {
  padding-bottom: 60px;
}

/* Hero区域 */
.hero-section {
  text-align: center;
  padding: 60px 20px;
  margin-bottom: 80px;
}

.hero-title {
  font-size: 42px;
  font-weight: 700;
  color: white;
  margin: 0 0 20px 0;
  line-height: 1.3;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.hero-description {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 40px 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.primary-button {
  min-width: 160px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.secondary-button {
  min-width: 160px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 24px;
  color: white;
  transition: all 0.3s ease;
}

.secondary-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 特性展示 */
.features-section {
  padding: 40px 0;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  text-align: center;
  margin: 0 0 48px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 60px;
}

.feature-card {
  text-align: center;
  padding: 32px 24px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
}

.dark-theme .feature-card {
  background: rgba(30, 30, 46, 0.8);
  color: rgba(255, 255, 255, 0.9);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.dark-theme .feature-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: inline-block;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.dark-theme .feature-title {
  color: rgba(255, 255, 255, 0.95);
}

.feature-description {
  font-size: 14px;
  color: #718096;
  margin: 0;
  line-height: 1.6;
}

.dark-theme .feature-description {
  color: rgba(255, 255, 255, 0.7);
}

/* 统计数据 */
.stats-section {
  padding: 60px 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin: 40px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  padding: 0 40px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.stat-label {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

/* 底部 */
.welcome-footer {
  padding: 40px 20px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.footer-text {
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 16px 0;
  font-size: 14px;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.footer-link {
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
}

.footer-link:hover {
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-container {
    padding: 10px;
  }

  .platform-name {
    font-size: 36px;
  }

  .platform-subtitle {
    font-size: 14px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-description {
    font-size: 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 20px;
  }

  .stat-value {
    font-size: 28px;
  }

  .stat-label {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .logo-icon {
    font-size: 48px;
  }

  .platform-name {
    font-size: 28px;
  }

  .hero-title {
    font-size: 24px;
  }

  .cta-buttons {
    flex-direction: column;
    width: 100%;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* Naive UI组件覆盖 */
:deep(.n-card) {
  border: none;
}

:deep(.n-button--primary-type) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.dark-theme :deep(.n-button--primary-type) {
  background: linear-gradient(135deg, #4c5fd7 0%, #5d3f8d 100%);
}

:deep(.n-divider) {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
