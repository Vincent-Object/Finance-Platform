<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <div id="app">
        <MainLayout v-if="shouldShowLayout" />
        <router-view v-else />
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NConfigProvider } from 'naive-ui'
import MainLayout from './components/MainLayout.vue'
import { useTheme } from './composables/useTheme'

export default {
  name: 'App',
  components: {
    MainLayout,
    NConfigProvider
  },
  setup() {
    const route = useRoute()
    const { theme } = useTheme()
    
    const shouldShowLayout = computed(() => {
      return route.meta?.requiresAuth === true
    })
    
    return {
      shouldShowLayout,
      theme
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: background-color 0.3s ease;
}

body.dark-theme,
.dark-theme #app {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

body.dark-theme {
  color-scheme: dark;
}
</style>