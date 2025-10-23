<template>
  <div class="login-container">
    <n-card class="login-card" :bordered="false">
      <div class="login-header">
        <n-h1 class="login-title">金融平台</n-h1>
        <n-p class="login-subtitle">Finance Platform</n-p>
      </div>
      
      <n-form ref="formRef" class="login-form" :model="formData" @submit.prevent="handleLogin">
        <n-form-item 
          label="用户名" 
          path="username" 
          :validate-trigger="['input', 'blur']"
        >
          <n-input
            v-model:value="formData.username"
            placeholder="请输入用户名"
            :status="errors.username ? 'error' : ''"
            size="large"
          />
        </n-form-item>
        
        <n-form-item 
          label="密码" 
          path="password" 
          :validate-trigger="['input', 'blur']"
        >
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="请输入密码"
            :status="errors.password ? 'error' : ''"
            size="large"
            show-password-on="mousedown"
          />
        </n-form-item>
        
        <div class="checkbox-group">
          <n-checkbox v-model:checked="formData.rememberMe">记住我</n-checkbox>
        </div>
        
        <n-button
          type="primary"
          :loading="isLoading"
          @click="handleLogin"
          class="login-button"
          size="large"
          block
        >
          登 录
        </n-button>
        
        <div class="login-footer">
          <n-button text type="primary" class="forgot-password">
            忘记密码？
          </n-button>
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<script>
import { ref, reactive, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'LoginPage',
  setup() {
    // 响应式数据
    const formData = reactive({
      username: '',
      password: '',
      rememberMe: false
    })
    
    const errors = reactive({
      username: '',
      password: ''
    })
    
    const isLoading = ref(false)
    const formRef = ref(null)
    
    // 注入message组件和路由
    const message = inject('message')
    const router = useRouter()
    const route = useRoute()
    
    // 表单验证
    const validateForm = () => {
      let isValid = true
      
      // 清除之前的错误
      errors.username = ''
      errors.password = ''
      
      // 验证用户名
      if (!formData.username.trim()) {
        errors.username = '请输入用户名'
        isValid = false
      } else if (formData.username.length < 3) {
        errors.username = '用户名至少3个字符'
        isValid = false
      }
      
      // 验证密码
      if (!formData.password) {
        errors.password = '请输入密码'
        isValid = false
      } else if (formData.password.length < 6) {
        errors.password = '密码至少6个字符'
        isValid = false
      }
      
      // 显示错误信息
      if (!isValid) {
        if (errors.username) {
          message.error(errors.username)
        }
        if (errors.password) {
          message.error(errors.password)
        }
      }
      
      return isValid
    }
    
    // 处理登录
    const handleLogin = async () => {
      if (!validateForm()) {
        return
      }
      
      isLoading.value = true
      
      try {
        // 模拟登录API调用
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        console.log('登录信息:', {
          username: formData.username,
          password: formData.password,
          rememberMe: formData.rememberMe
        })
        
        // 设置认证状态
        const authData = {
          isAuthenticated: true,
          username: formData.username,
          loginTime: new Date().toISOString()
        }
        
        // 根据"记住我"选择存储方式
        if (formData.rememberMe) {
          localStorage.setItem('authData', JSON.stringify(authData))
        } else {
          sessionStorage.setItem('authData', JSON.stringify(authData))
        }
        
        // 使用naive-ui的消息组件
        message.success('登录成功！正在跳转...')
        
        // 延迟跳转以显示成功消息
        setTimeout(async () => {
          try {
            // 检查是否有重定向参数
            const redirectPath = route.query.redirect || '/investments'
            await router.push(redirectPath)
          } catch (routerError) {
            console.error('路由跳转失败:', routerError)
            message.error('页面跳转失败，请刷新重试')
          }
        }, 1000)
        
        // 重置表单
        formData.username = ''
        formData.password = ''
        formData.rememberMe = false
        
      } catch (error) {
        console.error('登录失败:', error)
        message.error('登录失败，请重试')
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      formData,
      errors,
      isLoading,
      formRef,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  margin-bottom: 8px !important;
}

.login-subtitle {
  margin-bottom: 0 !important;
  opacity: 0.7;
}

.login-form {
  width: 100%;
}

.checkbox-group {
  margin-bottom: 24px;
}

.login-button {
  margin-bottom: 20px;
}

.login-footer {
  text-align: center;
}

.forgot-password {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }
  
  .login-card {
    padding: 15px;
  }
}

/* 覆盖Naive UI样式 */
:deep(.n-card) {
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

:deep(.n-input) {
  border-radius: 8px;
}

:deep(.n-button) {
  border-radius: 8px;
}

:deep(.n-form-item) {
  margin-bottom: 16px;
}

:deep(.n-h1) {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
}

:deep(.n-p) {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}
</style>