<script setup lang="ts">
import { ArrowDown, Download } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
</script>

<template>
  <section id="hero" class="relative min-h-screen overflow-hidden retro-scanlines">
    <div class="container relative z-10 mx-auto px-4 max-w-6xl h-screen flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4">
      <!-- Left: Text Content -->
      <div class="flex-1 text-center lg:text-left pt-20 lg:pt-0">
        <!-- Mobile Profile Photo -->
        <div class="flex justify-center mb-6 lg:hidden">
          <div class="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
            <img src="/lanyard-photo.jpg" alt="Muhammad Fakhri Alauddin" class="w-full h-full object-cover" />
          </div>
        </div>

        <p class="mb-4 text-lg text-muted-foreground font-display">
          <EffectsBlurText text="Hello, I'm" :delay="200" :duration="800" />
        </p>

        <h1 class="mb-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          <EffectsGlitchText
            text="Muhammad Fakhri Alauddin"
            class="text-primary retro-glow"
            :continuous="true"
            intensity="medium"
            :speed="4"
          />
        </h1>

        <p class="mx-auto lg:mx-0 mb-2 max-w-2xl text-xl text-muted-foreground font-display">
          <EffectsBlurText
            text="A Sofware Engineer with experience in API design, database management, and IoT-based solutions."
            :delay="600"
            :duration="1500"
          />
        </p>

        <p class="mb-8">
          <EffectsShinyText text="> Open to new opportunities_" :speed="3" class="text-sm font-mono retro-glow-cyan" />
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
          <Button as="a" href="#projects" size="lg" class="retro-pixel-border font-retro text-xs uppercase tracking-widest">
            View Projects
          </Button>
          <Button as="a" href="/cv.pdf" download variant="outline" size="lg" class="retro-pixel-border font-retro text-xs uppercase tracking-widest">
            <Download class="h-4 w-4 mr-2" />
            My Resume
          </Button>
        </div>
      </div>

      <!-- Right: Lanyard -->
      <div class="hidden lg:block flex-1 h-full max-h-screen relative">
        <ClientOnly>
          <EffectsLanyard
            title="Software Engineer"
            subtitle="Muhammad Fakhri Alauddin"
            badge-image="/lanyard-photo.jpg"
          />
        </ClientOnly>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
      <a
        href="#about"
        class="inline-flex animate-bounce text-primary retro-glow transition-colors"
        aria-label="Scroll to about"
      >
        <ArrowDown class="h-6 w-6" />
      </a>
    </div>
  </section>
</template>
