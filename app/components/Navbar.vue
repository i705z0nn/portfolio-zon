<script setup lang="ts">
import { Menu, X, Sun, Moon, Languages } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'

const isMobileMenuOpen = ref(false)
const { theme, toggleTheme } = useTheme()
const { locale, toggleLocale, t } = useI18n()

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

// Hide on scroll down (with glitch), show on scroll up (with glitch)
type NavState = 'visible' | 'glitch-out' | 'hidden' | 'glitch-in'
const navState = ref<NavState>('visible')
let lastScrollY = 0
let glitchTimer: ReturnType<typeof setTimeout> | null = null

function onScroll() {
  const currentY = window.scrollY
  if (currentY < 60) {
    if (navState.value !== 'visible') triggerGlitchIn()
  } else if (currentY > lastScrollY + 4) {
    if (navState.value === 'visible') {
      isMobileMenuOpen.value = false
      navState.value = 'glitch-out'
      glitchTimer = setTimeout(() => {
        navState.value = 'hidden'
        glitchTimer = null
      }, 400)
    }
  } else if (currentY < lastScrollY - 4) {
    if (navState.value === 'hidden' || navState.value === 'glitch-out') {
      triggerGlitchIn()
    }
  }
  lastScrollY = currentY
}

function triggerGlitchIn() {
  if (glitchTimer) { clearTimeout(glitchTimer); glitchTimer = null }
  navState.value = 'glitch-in'
  glitchTimer = setTimeout(() => {
    navState.value = 'visible'
    glitchTimer = null
  }, 400)
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (glitchTimer) clearTimeout(glitchTimer)
})

const navLinks = computed(() => [
  { label: t('navAbout'), href: '#about' },
  { label: t('navProjects'), href: '#projects' },
  { label: t('navSkills'), href: '#skills' },
  { label: t('navGuestBook'), href: '#guestbook' },
  { label: t('navContact'), href: '#contact' },
])
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 pointer-events-none"
    :class="{
      'navbar-visible': navState === 'visible',
      'navbar-glitch-out': navState === 'glitch-out',
      'navbar-hidden': navState === 'hidden',
      'navbar-glitch-in': navState === 'glitch-in',
    }"
  >
    <div class="flex items-center justify-center px-4 pt-4">
      <!-- Floating pill navbar -->
      <nav
        class="pointer-events-auto flex items-center gap-1 rounded-full border border-primary/30 bg-background/80 px-2 py-2 shadow-lg shadow-primary/5 backdrop-blur-xl retro-box-glow"
      >
        <!-- Desktop links -->
        <div class="hidden md:flex items-center gap-1">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="rounded-full px-4 py-1.5 text-xs font-retro text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary hover:retro-glow"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- Theme toggle -->
        <ClientOnly>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
            :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
            @click="toggleTheme"
          >
            <Sun v-if="theme === 'dark'" class="h-4 w-4" />
            <Moon v-else class="h-4 w-4" />
          </Button>
          <template #fallback>
            <span class="h-8 w-8" aria-hidden="true" />
          </template>
        </ClientOnly>

        <!-- Language toggle -->
        <ClientOnly>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
            :aria-label="locale === 'en' ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'"
            :title="locale === 'en' ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'"
            @click="toggleLocale"
          >
            <Languages class="h-4 w-4" />
          </Button>
          <template #fallback>
            <span class="h-8 w-8" aria-hidden="true" />
          </template>
        </ClientOnly>

        <!-- Mobile hamburger -->
        <button
          class="inline-flex md:hidden items-center justify-center rounded-full h-8 w-8 text-foreground hover:bg-accent transition-colors"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          aria-label="Toggle menu"
        >
          <X v-if="isMobileMenuOpen" class="h-4 w-4" />
          <Menu v-else class="h-4 w-4" />
        </button>

        <!-- Language toggle (mobile) -->
        <ClientOnly>
          <button
            class="inline-flex md:hidden items-center justify-center rounded-full h-8 w-8 text-foreground hover:bg-accent transition-colors"
            :aria-label="locale === 'en' ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'"
            @click="toggleLocale"
          >
            <Languages class="h-4 w-4" />
          </button>
          <template #fallback>
            <span class="h-8 w-8 md:hidden" aria-hidden="true" />
          </template>
        </ClientOnly>

        <!-- Theme toggle (mobile) -->
        <ClientOnly>
          <button
            class="inline-flex md:hidden items-center justify-center rounded-full h-8 w-8 text-foreground hover:bg-accent transition-colors"
            :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
            @click="toggleTheme"
          >
            <Sun v-if="theme === 'dark'" class="h-4 w-4" />
            <Moon v-else class="h-4 w-4" />
          </button>
          <template #fallback>
            <span class="h-8 w-8 md:hidden" aria-hidden="true" />
          </template>
        </ClientOnly>


      </nav>
    </div>

    <!-- Mobile dropdown -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-2 scale-95"
    >
      <div
        v-if="isMobileMenuOpen"
        class="pointer-events-auto md:hidden flex justify-center px-4 pt-2"
      >
        <div class="w-full max-w-xs rounded-2xl border border-border/50 bg-background/60 p-3 shadow-lg shadow-black/20 backdrop-blur-xl space-y-1">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="block rounded-xl px-4 py-2.5 text-xs font-retro text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            @click="closeMobileMenu"
          >
            {{ link.label }}
          </a>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.navbar-visible {
  transform: translateY(0);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.navbar-hidden {
  transform: translateY(-110%);
  transition: transform 0.25s ease-in;
}

.navbar-glitch-out {
  animation: navbar-glitch-out 0.4s ease-in forwards;
}

.navbar-glitch-in {
  animation: navbar-glitch-in 0.4s ease-out forwards;
}

@keyframes navbar-glitch-in {
  0% {
    transform: translateY(-110%) translateX(0);
    filter: none;
    opacity: 0;
  }
  20% {
    transform: translateY(-60%) translateX(3px);
    filter: hue-rotate(90deg) brightness(1.4);
    opacity: 0.4;
  }
  35% {
    transform: translateY(-20%) translateX(-4px) skewX(-2deg);
    filter: hue-rotate(-90deg) brightness(1.6);
    opacity: 0.7;
  }
  50% {
    transform: translateY(4px) translateX(3px) skewX(1.5deg);
    filter: hue-rotate(180deg) brightness(0.8);
    opacity: 0.85;
  }
  65% {
    transform: translateY(-3px) translateX(-2px) skewX(-1deg);
    filter: hue-rotate(45deg) brightness(1.3);
    opacity: 1;
  }
  78% {
    transform: translateY(2px) translateX(1px) skewX(0.5deg);
    filter: hue-rotate(-20deg);
    opacity: 1;
  }
  90% {
    transform: translateY(-1px) translateX(0);
    filter: none;
    opacity: 1;
  }
  100% {
    transform: translateY(0) translateX(0) skewX(0deg);
    filter: none;
    opacity: 1;
  }
}

@keyframes navbar-glitch-out {
  0% {
    transform: translateY(0) translateX(0) skewX(0deg);
    filter: none;
    opacity: 1;
  }
  10% {
    transform: translateY(-3px) translateX(-5px) skewX(-2deg);
    filter: hue-rotate(90deg) brightness(1.5);
    opacity: 1;
  }
  20% {
    transform: translateY(2px) translateX(4px) skewX(1.5deg);
    filter: hue-rotate(-90deg) brightness(0.7);
    opacity: 0.85;
  }
  30% {
    transform: translateY(-1px) translateX(-3px) skewX(-1deg);
    filter: hue-rotate(180deg) brightness(1.3);
    opacity: 1;
  }
  42% {
    transform: translateY(0) translateX(2px) skewX(0.5deg);
    filter: none;
    opacity: 0.9;
  }
  50% {
    transform: translateY(-5%) translateX(0) skewX(0deg);
    filter: brightness(1.2);
    opacity: 0.8;
  }
  65% {
    transform: translateY(-40%) translateX(-2px);
    filter: hue-rotate(45deg);
    opacity: 0.5;
  }
  100% {
    transform: translateY(-110%) translateX(0);
    filter: none;
    opacity: 0;
  }
}
</style>
