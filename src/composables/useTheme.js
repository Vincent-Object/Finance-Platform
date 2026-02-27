import { ref, computed, watch } from 'vue'
import { darkTheme } from 'naive-ui'

const THEME_STORAGE_KEY = 'finance_platform_theme'

const themeMode = ref(localStorage.getItem(THEME_STORAGE_KEY) || 'light')

export function useTheme() {
  const theme = computed(() => {
    return themeMode.value === 'dark' ? darkTheme : null
  })

  const isDark = computed(() => themeMode.value === 'dark')

  const setTheme = (mode) => {
    if (mode !== 'light' && mode !== 'dark') {
      console.warn('Invalid theme mode:', mode)
      return
    }
    themeMode.value = mode
    localStorage.setItem(THEME_STORAGE_KEY, mode)
    updateBodyClass(mode)
  }

  const toggleTheme = () => {
    const newMode = themeMode.value === 'light' ? 'dark' : 'light'
    setTheme(newMode)
  }

  const updateBodyClass = (mode) => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark-theme')
      document.body.classList.add('dark-theme')
    } else {
      document.documentElement.classList.remove('dark-theme')
      document.body.classList.remove('dark-theme')
    }
  }

  watch(themeMode, (newMode) => {
    updateBodyClass(newMode)
  }, { immediate: true })

  return {
    theme,
    themeMode,
    isDark,
    setTheme,
    toggleTheme
  }
}
