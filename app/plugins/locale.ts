import { useI18n } from '~/composables/useI18n'

export default defineNuxtPlugin(() => {
  const { locale } = useI18n()
  const cookie = useCookie<'en' | 'id'>('portfolio-locale')
  if (cookie.value === 'en' || cookie.value === 'id') {
    locale.value = cookie.value
  }
})