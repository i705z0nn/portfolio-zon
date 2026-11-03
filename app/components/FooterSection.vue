<script setup lang="ts">
import { Github, Linkedin, Mail, Home } from 'lucide-vue-next'
import { markRaw } from 'vue'

const { t } = useI18n()

const dockItems = [
  { icon: markRaw(Home), label: 'Home', href: '#hero' },
  { icon: markRaw(Github), label: 'GitHub', href: 'https://github.com/i705z0nn' },
  { icon: markRaw(Linkedin), label: 'LinkedIn', href: 'https://linkedin.com/in/mfkhria/' },
  { icon: markRaw(Mail), label: 'Email', href: 'mailto:fakhrizon607@gmail.com' },
]
</script>

<template>
  <footer class="border-t border-primary/20 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Dock -->
      <div class="flex justify-center mb-6">
        <EffectsDock :items="dockItems" :magnification="50" :distance="120" />
      </div>

      <div class="flex flex-col items-center justify-center gap-2 text-center">
        <p class="text-xs text-muted-foreground font-mono">
          {{ t('footerBuiltWith') }} <span class="text-primary font-medium">Nuxt.js</span>,
          <span class="text-primary font-medium">Tailwind CSS</span> &
          <span class="text-primary font-medium">Shadcn UI</span>
        </p>
        <p class="text-xs text-muted-foreground font-mono">
          &copy; {{ new Date().getFullYear() }} Muhammad Fakhri Alauddin. {{ t('footerRights') }}
          <NuxtLink
            to="/admin"
            class="secret-link"
            aria-label="admin"
            tabindex="-1"
          >_</NuxtLink>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.secret-link {
  opacity: 0.50; 
  color: inherit;
  text-decoration: none;
  cursor: default;
  user-select: none;
  transition: opacity 0.4s ease;
  margin-left: 2px;
}
.secret-link:hover {
  opacity: 0.25;
  cursor: pointer;
}
</style>
