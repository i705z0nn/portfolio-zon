import { ref } from 'vue'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'portfolio-theme'
const theme = ref<Theme>('dark')

function applyTheme(value: Theme) {
  const html = document.documentElement
  html.classList.add('theme-transitioning')
  html.classList.toggle('light', value === 'light')
  window.setTimeout(() => html.classList.remove('theme-transitioning'), 350)
}

export function useTheme() {
  function initTheme() {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored === 'light' || stored === 'dark') {
      theme.value = stored
    }
    document.documentElement.classList.toggle('light', theme.value === 'light')
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, theme.value)
    applyTheme(theme.value)
  }

  return {
    theme,
    initTheme,
    toggleTheme,
  }
}