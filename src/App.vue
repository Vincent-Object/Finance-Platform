<template>
  <div id="app">
    <n-message-provider>
      <MainLayout v-if="shouldShowLayout" />
      <router-view v-else />
    </n-message-provider>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from './components/MainLayout.vue'

export default {
  name: 'App',
  components: {
    MainLayout
  },
  setup() {
    const route = useRoute()
    
    const shouldShowLayout = computed(() => {
      return route.meta?.requiresAuth === true
    })
    
    return {
      shouldShowLayout
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>