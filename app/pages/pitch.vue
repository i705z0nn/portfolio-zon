<script setup lang="ts">
// Hidden page — not linked anywhere on the site, excluded from robots.txt.
// Access: /pitch?key=<PITCH_ACCESS_KEY>
const route = useRoute()

const ACCESS_KEY = 'zon-pitch-2026'
const authorized = computed(() => route.query.key === ACCESS_KEY)

useHead({
  title: authorized ? 'Interview Pitch — Portfolio Zon' : 'Portfolio Zon',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

function submitKey(e: Event) {
  const input = (e.target as HTMLFormElement).elements.namedItem('key') as HTMLInputElement
  const value = input?.value.trim()
  if (value) {
    navigateTo({ path: '/pitch', query: { key: value } })
  }
}
</script>

<template>
  <div class="min-h-screen text-foreground antialiased">
    <EffectsGradientBackground />

    <div class="relative z-10">
      <!-- Gate: wrong/missing key -->
      <div v-if="!authorized" class="flex min-h-screen items-center justify-center px-4">
        <div class="w-full max-w-md rounded-lg border border-primary/20 bg-card/60 p-8 backdrop-blur-sm shadow-sm retro-box-glow">
          <h1 class="mb-2 text-lg font-bold tracking-tight">
            <EffectsGlitchText text="RESTRICTED AREA" class="retro-glow" :continuous="false" intensity="low" />
          </h1>
          <p class="mb-6 text-sm text-muted-foreground font-mono">
            &gt; Masukkan access key untuk membuka halaman ini_
          </p>
          <form class="space-y-4" @submit.prevent="submitKey">
            <div class="space-y-2">
              <label for="key" class="text-sm font-medium leading-none">Access Key</label>
              <Input id="key" name="key" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" class="w-full retro-pixel-border font-retro text-xs uppercase tracking-widest">
              Unlock
            </Button>
          </form>
        </div>
      </div>

      <!-- Authorized: pitch content -->
      <template v-else>
        <Navbar />
        <main>
          <SectionsPitchSection />
        </main>
        <FooterSection />
      </template>
    </div>
  </div>
</template>