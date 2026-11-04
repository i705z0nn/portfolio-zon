<script setup lang="ts">
useHead({
  title: 'Portfolio Zon',
  meta: [
    { name: 'description', content: 'Fresh graduate with experience in backend development, API design, database management, IT system troubleshooting, website programming, and IoT-based solutions.' },
  ],
})
</script>

<template>
  <div class="min-h-screen text-foreground antialiased scroll-smooth">
    <!-- Global gradient background — fixed behind all content -->
    <EffectsGradientBackground />

    <!-- Content wrapper — positioned above the fixed gradient -->
    <div class="relative z-10">
      <ScrollProgress />
      <NuxtRouteAnnouncer />
      <Navbar />
      <PitchSync />
      <EffectsScrollGlitch :threshold="60" :duration="250" :cooldown="1000">
        <main>
          <SectionsHeroSection />
          <SectionsAboutSection />
          <SectionsContributionsSection />
          <SectionsProjectsSection />
          <SectionsSkillsSection />
          <SectionsGuestBookSection />
          <SectionsContactSection />
        </main>
      </EffectsScrollGlitch>
      <FooterSection />
    </div>
  </div>
</template>
