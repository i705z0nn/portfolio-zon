<script setup lang="ts">
const username = 'i705z0nn'
const { t } = useI18n()
const isVisible = ref(false)
const sectionRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.15 },
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>

<template>
  <section id="contributions" ref="sectionRef" class="py-16 sm:py-24">
    <div class="container mx-auto max-w-5xl px-4">
      <!-- Header -->
      <div
        class="mb-2 text-center transition-all duration-700"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <h2 class="text-2xl font-bold tracking-tight">
          <EffectsGlitchText :text="t('contributionsTitle')" class="retro-glow" :continuous="false" intensity="low" />
        </h2>
      </div>
      <p
        class="mb-10 text-center text-muted-foreground font-display text-lg transition-all duration-700 delay-100"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <EffectsScrambledText :text="t('contributionsSubtitle')" :speed="40" />
      </p>

      <!-- Calendar Card -->
      <div
        class="rounded-lg border border-primary/20 bg-card/60 backdrop-blur-sm p-4 sm:p-6 shadow-sm retro-box-glow transition-all duration-700 delay-200"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        <!-- GitHub Link -->
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm text-muted-foreground font-mono">
            <Icon name="simple-icons:github" class="h-4 w-4" />
            <a
              :href="`https://github.com/${username}`"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-primary transition-colors"
            >
              @{{ username }}
            </a>
          </div>
          <a
            :href="`https://github.com/${username}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-muted-foreground hover:text-primary transition-colors font-mono flex items-center gap-1"
          >
            {{ t('contributionsViewProfile') }}
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <!-- Heatmap -->
        <EffectsGitHubCalendar :username="username" />
      </div>
    </div>
  </section>
</template>
