<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 头像与基本信息卡片 -->
      <n-card :bordered="false" class="profile-header-card">
        <div class="profile-header">
          <div class="avatar-section">
            <div class="avatar" :style="{ background: avatarColor }">
              {{ avatarText }}
            </div>
            <div class="user-basic">
              <h2 class="username">{{ profileData.nickname || profileData.username }}</h2>
              <n-tag :type="'success'" size="small" round>已认证用户</n-tag>
              <p class="login-time">上次登录：{{ formattedLoginTime }}</p>
            </div>
          </div>
        </div>
      </n-card>

      <!-- 个人信息编辑卡片 -->
      <n-card title="个人信息" :bordered="false" class="profile-detail-card">
        <template #header-extra>
          <n-button
            v-if="!isEditing"
            type="primary"
            text
            @click="isEditing = true"
          >
            编辑资料
          </n-button>
          <div v-else class="edit-actions-inline">
            <n-button text @click="cancelEdit">取消</n-button>
            <n-button type="primary" text @click="saveProfile" :loading="saving">保存</n-button>
          </div>
        </template>

        <n-form
          ref="formRef"
          :model="editData"
          label-placement="left"
          label-width="100"
          :disabled="!isEditing"
        >
          <n-grid :cols="2" :x-gap="24" :y-gap="4" responsive="screen" item-responsive>
            <n-grid-item span="2 m:1">
              <n-form-item label="用户名">
                <n-input
                  :value="profileData.username"
                  disabled
                  placeholder="用户名不可修改"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2 m:1">
              <n-form-item label="昵称">
                <n-input
                  v-model:value="editData.nickname"
                  placeholder="请输入昵称"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2 m:1">
              <n-form-item label="邮箱">
                <n-input
                  v-model:value="editData.email"
                  placeholder="请输入邮箱"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2 m:1">
              <n-form-item label="手机号">
                <n-input
                  v-model:value="editData.phone"
                  placeholder="请输入手机号"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2">
              <n-form-item label="个人简介">
                <n-input
                  v-model:value="editData.bio"
                  type="textarea"
                  placeholder="介绍一下自己吧"
                  :rows="3"
                />
              </n-form-item>
            </n-grid-item>
          </n-grid>
        </n-form>
      </n-card>

      <!-- 主题设置 -->
      <n-card title="外观设置" :bordered="false" class="profile-detail-card">
        <div class="theme-settings">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">主题模式</span>
              <span class="setting-desc">选择浅色或深色主题</span>
            </div>
            <div class="theme-toggle-group">
              <n-button 
                :type="!isDark ? 'primary' : 'default'"
                @click="setTheme('light')"
                size="small"
                class="theme-button"
              >
                <template #icon>
                  <span>☀️</span>
                </template>
                浅色
              </n-button>
              <n-button 
                :type="isDark ? 'primary' : 'default'"
                @click="setTheme('dark')"
                size="small"
                class="theme-button"
              >
                <template #icon>
                  <span>🌙</span>
                </template>
                深色
              </n-button>
            </div>
          </div>
          <n-divider style="margin: 12px 0;" />
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">快速切换</span>
              <span class="setting-desc">使用开关快速切换主题</span>
            </div>
            <n-switch 
              :value="isDark" 
              @update:value="toggleTheme"
              size="large"
            >
              <template #checked>
                🌙
              </template>
              <template #unchecked>
                ☀️
              </template>
            </n-switch>
          </div>
        </div>
      </n-card>

      <!-- 投资偏好设置 -->
      <n-card title="投资偏好" :bordered="false" class="profile-detail-card">
        <template #header-extra>
          <n-button
            v-if="!isEditingPrefs"
            type="primary"
            text
            @click="isEditingPrefs = true"
          >
            编辑偏好
          </n-button>
          <div v-else class="edit-actions-inline">
            <n-button text @click="cancelPrefsEdit">取消</n-button>
            <n-button type="primary" text @click="savePreferences" :loading="savingPrefs">保存</n-button>
          </div>
        </template>

        <n-form
          :model="editPrefs"
          label-placement="left"
          label-width="100"
          :disabled="!isEditingPrefs"
        >
          <n-grid :cols="2" :x-gap="24" :y-gap="4" responsive="screen" item-responsive>
            <n-grid-item span="2 m:1">
              <n-form-item label="风险偏好">
                <n-select
                  v-model:value="editPrefs.riskLevel"
                  :options="riskOptions"
                  placeholder="请选择风险偏好"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2 m:1">
              <n-form-item label="投资风格">
                <n-select
                  v-model:value="editPrefs.investStyle"
                  :options="styleOptions"
                  placeholder="请选择投资风格"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2 m:1">
              <n-form-item label="关注板块">
                <n-select
                  v-model:value="editPrefs.sectors"
                  :options="sectorOptions"
                  multiple
                  placeholder="请选择关注板块"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2 m:1">
              <n-form-item label="持仓周期">
                <n-select
                  v-model:value="editPrefs.holdingPeriod"
                  :options="periodOptions"
                  placeholder="请选择持仓周期"
                />
              </n-form-item>
            </n-grid-item>
          </n-grid>
        </n-form>
      </n-card>

      <!-- 账户安全 -->
      <n-card title="账户安全" :bordered="false" class="profile-detail-card">
        <div class="security-items">
          <div class="security-item">
            <div class="security-info">
              <span class="security-label">登录密码</span>
              <span class="security-desc">定期修改密码有助于保护账户安全</span>
            </div>
            <n-button size="small" @click="handleChangePassword">修改密码</n-button>
          </div>
          <div class="security-item">
            <div class="security-info">
              <span class="security-label">退出登录</span>
              <span class="security-desc">退出当前账户</span>
            </div>
            <n-popconfirm @positive-click="handleLogout">
              <template #trigger>
                <n-button size="small" type="error">退出登录</n-button>
              </template>
              确定要退出登录吗？
            </n-popconfirm>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import dayjs from 'dayjs'
import { useTheme } from '../composables/useTheme'

const PROFILE_STORAGE_KEY = 'finance_platform_profile'
const PREFS_STORAGE_KEY = 'finance_platform_preferences'

const router = useRouter()
const message = useMessage()
const { isDark, setTheme, toggleTheme } = useTheme()

const isEditing = ref(false)
const isEditingPrefs = ref(false)
const saving = ref(false)
const savingPrefs = ref(false)
const formRef = ref(null)

const profileData = reactive({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  bio: '',
  loginTime: ''
})

const editData = reactive({
  nickname: '',
  email: '',
  phone: '',
  bio: ''
})

const editPrefs = reactive({
  riskLevel: null,
  investStyle: null,
  sectors: [],
  holdingPeriod: null
})

const prefsData = reactive({
  riskLevel: null,
  investStyle: null,
  sectors: [],
  holdingPeriod: null
})

const riskOptions = [
  { label: '保守型 - 追求稳健收益', value: 'conservative' },
  { label: '稳健型 - 平衡风险与收益', value: 'balanced' },
  { label: '积极型 - 可承受较高风险', value: 'aggressive' },
  { label: '激进型 - 追求高收益', value: 'radical' }
]

const styleOptions = [
  { label: '价值投资', value: 'value' },
  { label: '成长投资', value: 'growth' },
  { label: '趋势投资', value: 'trend' },
  { label: '量化投资', value: 'quant' }
]

const sectorOptions = [
  { label: '科技', value: 'tech' },
  { label: '金融', value: 'finance' },
  { label: '医药', value: 'medical' },
  { label: '消费', value: 'consumer' },
  { label: '新能源', value: 'energy' },
  { label: '制造业', value: 'manufacturing' },
  { label: '房地产', value: 'realestate' },
  { label: '军工', value: 'military' }
]

const periodOptions = [
  { label: '短线（1周以内）', value: 'short' },
  { label: '中线（1-3个月）', value: 'medium' },
  { label: '长线（3个月以上）', value: 'long' },
  { label: '超长线（1年以上）', value: 'ultra_long' }
]

const avatarText = computed(() => {
  const name = profileData.nickname || profileData.username
  return name ? name.charAt(0).toUpperCase() : '?'
})

const avatarColor = computed(() => {
  const name = profileData.nickname || profileData.username
  if (!name) return '#8b5cf6'
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#3b82f6', '#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444']
  return colors[Math.abs(hash) % colors.length]
})

const formattedLoginTime = computed(() => {
  if (!profileData.loginTime) return '未知'
  return dayjs(profileData.loginTime).format('YYYY-MM-DD HH:mm:ss')
})

const loadAuthData = () => {
  const localAuth = localStorage.getItem('authData')
  const sessionAuth = sessionStorage.getItem('authData')
  const raw = localAuth || sessionAuth
  if (raw) {
    try {
      const data = JSON.parse(raw)
      profileData.username = data.username || ''
      profileData.loginTime = data.loginTime || ''
    } catch (e) {
      console.error('解析认证数据失败:', e)
    }
  }
}

const loadProfile = () => {
  const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
  if (raw) {
    try {
      const data = JSON.parse(raw)
      Object.assign(profileData, data)
    } catch (e) {
      console.error('解析个人资料失败:', e)
    }
  }
  syncEditData()
}

const loadPreferences = () => {
  const raw = localStorage.getItem(PREFS_STORAGE_KEY)
  if (raw) {
    try {
      const data = JSON.parse(raw)
      Object.assign(prefsData, data)
    } catch (e) {
      console.error('解析投资偏好失败:', e)
    }
  }
  syncEditPrefs()
}

const syncEditData = () => {
  editData.nickname = profileData.nickname || ''
  editData.email = profileData.email || ''
  editData.phone = profileData.phone || ''
  editData.bio = profileData.bio || ''
}

const syncEditPrefs = () => {
  editPrefs.riskLevel = prefsData.riskLevel
  editPrefs.investStyle = prefsData.investStyle
  editPrefs.sectors = prefsData.sectors ? [...prefsData.sectors] : []
  editPrefs.holdingPeriod = prefsData.holdingPeriod
}

const cancelEdit = () => {
  syncEditData()
  isEditing.value = false
}

const cancelPrefsEdit = () => {
  syncEditPrefs()
  isEditingPrefs.value = false
}

const saveProfile = async () => {
  if (editData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
    message.error('请输入有效的邮箱地址')
    return
  }
  if (editData.phone && !/^1[3-9]\d{9}$/.test(editData.phone)) {
    message.error('请输入有效的手机号')
    return
  }

  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    profileData.nickname = editData.nickname
    profileData.email = editData.email
    profileData.phone = editData.phone
    profileData.bio = editData.bio

    const toSave = {
      nickname: profileData.nickname,
      email: profileData.email,
      phone: profileData.phone,
      bio: profileData.bio
    }
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(toSave))

    isEditing.value = false
    message.success('个人资料保存成功')
  } catch (error) {
    message.error('保存失败: ' + error.message)
  } finally {
    saving.value = false
  }
}

const savePreferences = async () => {
  savingPrefs.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    Object.assign(prefsData, {
      riskLevel: editPrefs.riskLevel,
      investStyle: editPrefs.investStyle,
      sectors: [...editPrefs.sectors],
      holdingPeriod: editPrefs.holdingPeriod
    })
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefsData))

    isEditingPrefs.value = false
    message.success('投资偏好保存成功')
  } catch (error) {
    message.error('保存失败: ' + error.message)
  } finally {
    savingPrefs.value = false
  }
}

const handleChangePassword = () => {
  message.info('修改密码功能开发中...')
}

const handleLogout = () => {
  localStorage.removeItem('authData')
  sessionStorage.removeItem('authData')
  message.success('已退出登录')
  setTimeout(() => {
    router.push('/login')
  }, 500)
}

onMounted(() => {
  loadAuthData()
  loadProfile()
  loadPreferences()
})
</script>

<style scoped>
.profile-page {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
}

.profile-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-header-card {
  border-radius: 12px;
  overflow: hidden;
}

.profile-header {
  display: flex;
  align-items: center;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-basic {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.username {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #1a1a2e;
}

.login-time {
  margin: 0;
  font-size: 13px;
  color: #999;
}

.profile-detail-card {
  border-radius: 12px;
}

.edit-actions-inline {
  display: flex;
  gap: 12px;
}

.security-items {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.security-item:last-child {
  border-bottom: none;
}

.security-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.security-label {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.security-desc {
  font-size: 13px;
  color: #999;
}

.theme-settings {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.setting-label {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.setting-desc {
  font-size: 13px;
  color: #999;
}

.theme-toggle-group {
  display: flex;
  gap: 8px;
}

.theme-button {
  min-width: 80px;
}

.dark-theme .setting-label {
  color: #e0e0e0;
}

.dark-theme .setting-desc {
  color: #999;
}

.dark-theme .profile-page {
  background-color: #1a1a2e;
}

.dark-theme .page-title {
  color: #e0e0e0;
}

.dark-theme .username {
  color: #e0e0e0;
}

.dark-theme .security-label {
  color: #e0e0e0;
}

:deep(.n-card) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

:deep(.n-card-header) {
  padding-bottom: 12px;
}

:deep(.n-form-item .n-form-item-label) {
  color: #666;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 16px;
  }

  .avatar-section {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .user-basic {
    align-items: center;
  }

  .avatar {
    width: 64px;
    height: 64px;
    font-size: 26px;
  }

  .username {
    font-size: 18px;
  }

  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .profile-page {
    padding: 12px;
  }
}
</style>
