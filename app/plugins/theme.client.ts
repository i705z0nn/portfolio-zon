import { useTheme } from '~/composables/useTheme'
import { useI18n } from '~/composables/useI18n'

export default defineNuxtPlugin(() => {
  const { initTheme } = useTheme()
  initTheme()
  const { initLocale } = useI18n()
  initLocale()
})