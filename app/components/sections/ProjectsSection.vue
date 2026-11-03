<script setup lang="ts">
import { Github, ExternalLink } from 'lucide-vue-next'
import type { ApiProject } from '~/composables/usePublicApi'

const { t, locale } = useI18n()

const { fetchProjects } = usePublicApi()
const projects = ref<ApiProject[]>([])
const isVisible = ref(false)
const sectionRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
const activeIndex = ref(0)

// Indonesian translations for project descriptions (fallback: DB description)
const projectDescId: Record<string, string> = {
  'New Arsipku':
    'Sistem tata naskah modern untuk AirNav Indonesia yang dibangun dengan NestJS, meningkatkan performa, skalabilitas, dan kemudahan perawatan untuk komunikasi resmi internal dan eksternal sehari-hari.',
  'NavEvent':
    'Platform digital untuk efisiensi dan transparansi dalam mengelola kegiatan AirNav Indonesia. Memungkinkan alur kerja paperless real-time, percepatan distribusi sertifikat, dan dashboard real-time.',
  'HydroEye':
    'Sistem penghitungan benih ikan otomatis menggunakan YOLOv5, Orange Pi Zero 3, dan kamera statis, mencapai akurasi deteksi 95–97% dengan monitoring real-time dan ekspor ke Google Sheets.',
  'IoT Hydroponic Monitor':
    'Website berbasis IoT menggunakan JavaScript, Firebase, dan Next.js untuk mengintegrasikan monitoring perangkat keras dengan antarmuka web responsif dan tampilan data sensor real-time via ESP8266.',
  'Kanzon':
    'Kanzon adalah aplikasi manajemen proyek berbasis Kanban yang dirancang untuk membantu tim mengelola workspace, proyek, tugas, anggota tim, alur review, notifikasi, dan analitik dalam satu platform.',
}

function projectDescription(project: ApiProject): string {
  if (locale.value === 'id' && projectDescId[project.title]) {
    return projectDescId[project.title]!
  }
  return project.description
}

// Tech icon map
const techIconMap: Record<string, string> = {
  'Vue.js': 'simple-icons:vuedotjs',
  'Nuxt.js': 'simple-icons:nuxtdotjs',
  'Next.js': 'simple-icons:nextdotjs',
  'React': 'simple-icons:react',
  'TypeScript': 'simple-icons:typescript',
  'JavaScript': 'simple-icons:javascript',
  'Tailwind CSS': 'simple-icons:tailwindcss',
  'HTML/CSS': 'simple-icons:html5',
  'NestJS': 'simple-icons:nestjs',
  'Node.js': 'simple-icons:nodedotjs',
  'Express': 'simple-icons:express',
  'Python': 'simple-icons:python',
  'FastAPI': 'simple-icons:fastapi',
  'Django': 'simple-icons:django',
  'REST API': 'simple-icons:openapiinitiative',
  'GraphQL': 'simple-icons:graphql',
  'PostgreSQL': 'simple-icons:postgresql',
  'MySQL': 'simple-icons:mysql',
  'MongoDB': 'simple-icons:mongodb',
  'Firebase': 'simple-icons:firebase',
  'Prisma': 'simple-icons:prisma',
  'Redis': 'simple-icons:redis',
  'Docker': 'simple-icons:docker',
  'Git': 'simple-icons:git',
  'GitHub': 'simple-icons:github',
  'Linux': 'simple-icons:linux',
  'AWS': 'simple-icons:amazonaws',
  'Vercel': 'simple-icons:vercel',
  'Figma': 'simple-icons:figma',
  'Flutter': 'simple-icons:flutter',
  'Kotlin': 'simple-icons:kotlin',
  'PHP': 'simple-icons:php',
  'Laravel': 'simple-icons:laravel',
  'CI/CD': 'simple-icons:githubactions',
  'Arduino': 'simple-icons:arduino',
  'MQTT': 'simple-icons:mqtt',
  'TensorFlow': 'simple-icons:tensorflow',
  'OpenAI': 'simple-icons:openai',
  'Supabase': 'simple-icons:supabase',
  'Three.js': 'simple-icons:threedotjs',
}

function getTechIcon(name: string): string | null {
  return techIconMap[name] ?? null
}

// Throttled scroll handler using rAF
let rafId = 0
function onScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    const el = scrollRef.value
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    const maxScroll = scrollHeight - clientHeight
    scrollProgress.value = maxScroll > 0 ? scrollTop / maxScroll : 0

    // Determine which project is most visible
    const children = el.children
    const containerTop = el.getBoundingClientRect().top
    const containerBottom = containerTop + clientHeight
    let best = 0
    let bestVisible = 0
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (!child) continue
      const rect = child.getBoundingClientRect()
      const top = Math.max(rect.top, containerTop)
      const bottom = Math.min(rect.bottom, containerBottom)
      const visible = bottom - top
      if (visible > bestVisible) {
        bestVisible = visible
        best = i
      }
    }
    activeIndex.value = best
  })
}

onUnmounted(() => { if (rafId) cancelAnimationFrame(rafId) })

// Scroll to a specific project
function scrollToProject(index: number) {
  const el = scrollRef.value
  if (!el) return
  const children = el.querySelectorAll('.project-block')
  const target = children[index] as HTMLElement | undefined
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(async () => {
  try {
    projects.value = await fetchProjects()
  } catch (e) {
    console.error('Failed to fetch projects:', e)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.1 },
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>

<template>
  <section
    id="projects"
    ref="sectionRef"
    class="relative py-16 sm:py-24"
  >
    <div class="container mx-auto px-4 max-w-7xl">
      <!-- Heading -->
      <h2 class="mb-2 text-2xl font-bold tracking-tight text-center">
        <EffectsGlitchText :text="t('projectsTitle')" class="retro-glow" :continuous="false" intensity="low" />
      </h2>
      <p class="mb-10 sm:mb-14 text-center text-muted-foreground font-display text-lg">
        <EffectsScrambledText :text="t('projectsSubtitle')" :speed="40" />
      </p>

      <!-- Scroll showcase wrapper -->
      <div
        class="scroll-showcase"
        :class="{ 'scroll-showcase--visible': isVisible }"
      >
        <!-- Scrollable content -->
        <div
          ref="scrollRef"
          class="scroll-viewport"
          @scroll.passive="onScroll"
        >
          <!-- Each project block (full-width row) -->
          <div
            v-for="(project, i) in projects"
            :key="project.id"
            class="project-block"
          >
            <div class="project-block__row">
              <!-- Left: Info -->
              <div class="project-block__info">
                <!-- Title -->
                <div class="flex items-start gap-3 mb-3">
                  <div class="mt-2 h-1 w-6 rounded-full bg-primary shrink-0 shadow-[0_0_10px_var(--fx-glow)]" />
                  <h3 class="font-retro text-lg sm:text-xl lg:text-2xl text-primary retro-glow leading-tight">
                    {{ project.title }}
                  </h3>
                </div>

                <!-- Description -->
                <p class="text-sm text-muted-foreground/80 leading-relaxed font-mono mb-5 max-w-md">
                  {{ projectDescription(project) }}
                </p>

                <!-- Feature bullets (parse sentences from description) -->
                <ul class="space-y-2 mb-6">
                  <li
                    v-for="(tech, ti) in project.tech.slice(0, 3)"
                    :key="ti"
                    class="flex items-start gap-2 text-sm text-muted-foreground/70 font-mono"
                  >
                    <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0" />
                    <span>{{ t('projectsBuiltWith') }} <span class="text-primary/80">{{ tech }}</span></span>
                  </li>
                </ul>

                <!-- Tech Stack badges -->
                <div class="flex flex-wrap gap-2 mb-6">
                  <span
                    v-for="tech in project.tech"
                    :key="tech"
                    class="tech-chip"
                  >
                    <Icon
                      v-if="getTechIcon(tech)"
                      :name="getTechIcon(tech)!"
                      class="tech-chip__icon"
                    />
                    <span v-else class="tech-chip__dot" />
                    {{ tech }}
                  </span>
                </div>

                <!-- Action links -->
                <div class="flex items-center gap-3">
                  <a
                    v-if="project.github"
                    :href="project.github"
                    target="_blank"
                    rel="noopener"
                    class="project-link"
                  >
                    <Github class="h-4 w-4" />
                    <span>{{ t('projectsSource') }}</span>
                  </a>
                  <a
                    v-if="project.liveUrl"
                    :href="project.liveUrl"
                    target="_blank"
                    rel="noopener"
                    class="project-link project-link--primary"
                  >
                    <ExternalLink class="h-4 w-4" />
                    <span>{{ t('projectsLiveDemo') }}</span>
                  </a>
                </div>
              </div>

              <!-- Right: Image showcase -->
              <div class="project-block__visual">
                <div v-if="project.image || project.mobileImage" class="visual-collage">
                  <!-- Desktop frame -->
                  <div v-if="project.image" class="frame-desktop">
                    <div class="frame-desktop__bar">
                      <span class="frame-dot" />
                      <span class="frame-dot" />
                      <span class="frame-dot" />
                    </div>
                    <div class="frame-desktop__screen">
                      <img
                        :src="project.image"
                        :alt="`${project.title} - desktop`"
                        class="project-img"
                        draggable="false"
                      />
                      <div class="frame-scanlines" />
                    </div>
                  </div>
                  <!-- Mobile frame -->
                  <div v-if="project.mobileImage || project.image" class="frame-mobile">
                    <div class="frame-mobile__notch" />
                    <div class="frame-mobile__screen">
                      <img
                        :src="project.mobileImage || project.image!"
                        :alt="`${project.title} - mobile`"
                        class="project-img project-img--mobile"
                        draggable="false"
                      />
                      <div class="frame-scanlines" />
                    </div>
                  </div>
                </div>
                <div v-else class="visual-placeholder">
                  <span class="text-7xl font-retro text-primary/15 retro-glow select-none">
                    {{ project.title.charAt(0) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Divider between projects -->
            <div v-if="i < projects.length - 1" class="project-divider" />
          </div>
        </div>

        <!-- Scroll progress bar (center vertical timeline) -->
        <div class="scroll-progress" aria-hidden="true">
          <div class="scroll-progress__track" />
          <div
            class="scroll-progress__fill"
            :style="{ transform: `scaleY(${scrollProgress})` }"
          />
          <div
            class="scroll-progress__thumb"
            :style="{ transform: `translate(-50%, -50%) translateY(${scrollProgress * 100}cqh)` }"
          />
        </div>

        <!-- Side nav dots -->
        <div v-if="projects.length > 1" class="scroll-nav">
          <button
            v-for="(project, i) in projects"
            :key="project.id"
            :aria-label="`Go to ${project.title}`"
            class="scroll-nav__dot"
            :class="{ 'scroll-nav__dot--active': i === activeIndex }"
            @click="scrollToProject(i)"
          />
        </div>
      </div>

      <!-- Counter -->
      <p v-if="projects.length > 0" class="text-center text-xs text-muted-foreground font-mono mt-6">
        {{ activeIndex + 1 }}
        <span class="text-primary/50">/</span>
        {{ projects.length }} {{ t('projectsCounter') }}
      </p>
    </div>
  </section>
</template>

<style scoped>
/* ── Scroll Showcase Container ──────────────────────────── */
.scroll-showcase {
  position: relative;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.scroll-showcase--visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Scroll Viewport (bounded height, scrolls inside) ──── */
.scroll-viewport {
  max-height: 75vh;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  padding-right: 1rem;
  contain: layout style;

  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--fx-line-strong) 40%, transparent) transparent;
}
.scroll-viewport::-webkit-scrollbar {
  width: 4px;
}
.scroll-viewport::-webkit-scrollbar-track {
  background: transparent;
}
.scroll-viewport::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--fx-line-strong) 30%, transparent);
  border-radius: 4px;
}
.scroll-viewport::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--fx-glow) 50%, transparent);
}

/* ── Project Block ──────────────────────────────────────── */
.project-block {
  padding: 2rem 0;
}
.project-block:first-child {
  padding-top: 0.5rem;
}
.project-block:last-child {
  padding-bottom: 0.5rem;
}

.project-block__row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 768px) {
  .project-block__row {
    grid-template-columns: 1fr 1.2fr;
    gap: 3rem;
  }
}

@media (min-width: 1024px) {
  .project-block__row {
    grid-template-columns: 1fr 1.3fr;
    gap: 4rem;
  }
}

/* Alternate: even projects flip layout */
@media (min-width: 768px) {
  .project-block:nth-child(even) .project-block__row {
    direction: rtl;
  }
  .project-block:nth-child(even) .project-block__row > * {
    direction: ltr;
  }
}

/* ── Info Side ──────────────────────────────────────────── */
.project-block__info {
  padding: 0 0.5rem;
}

/* ── Visual Side ────────────────────────────────────────── */
.project-block__visual {
  position: relative;
}

.visual-collage {
  position: relative;
  min-height: 280px;
}

@media (min-width: 768px) {
  .visual-collage {
    min-height: 340px;
  }
}

.visual-placeholder {
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  background: linear-gradient(135deg, var(--fx-surface-4) 0%, var(--fx-surface-2) 100%);
  border: 1px solid color-mix(in srgb, var(--fx-line-strong) 20%, transparent);
}

/* ── Desktop Frame ──────────────────────────────────────── */
.frame-desktop {
  position: relative;
  width: 90%;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--fx-line-strong) 30%, transparent);
  background: var(--fx-surface-2);
  box-shadow:
    0 8px 40px color-mix(in srgb, var(--fx-surface-0) 50%, transparent),
    0 0 60px color-mix(in srgb, var(--fx-glow) 6%, transparent);
  z-index: 1;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.5s ease;
  transform: translateZ(0);
  contain: content;
}

.visual-collage:hover .frame-desktop {
  transform: translateY(-4px);
  box-shadow:
    0 12px 50px color-mix(in srgb, var(--fx-surface-0) 60%, transparent),
    0 0 80px color-mix(in srgb, var(--fx-glow) 10%, transparent);
}

.frame-desktop__bar {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  background: var(--fx-surface-4);
  border-bottom: 1px solid color-mix(in srgb, var(--fx-line) 20%, transparent);
}

.frame-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--fx-line-strong) 50%, transparent);
}
.frame-dot:first-child { background: hsl(0 60% 45%); }
.frame-dot:nth-child(2) { background: hsl(45 70% 50%); }
.frame-dot:last-child { background: var(--primary); }

.frame-desktop__screen {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

/* ── Mobile Frame ───────────────────────────────────────── */
.frame-mobile {
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 28%;
  max-width: 140px;
  border-radius: 1rem;
  overflow: hidden;
  border: 2px solid color-mix(in srgb, var(--fx-line-strong) 35%, transparent);
  background: var(--fx-surface-2);
  box-shadow:
    0 8px 30px color-mix(in srgb, var(--fx-surface-0) 60%, transparent),
    0 0 40px color-mix(in srgb, var(--fx-glow) 6%, transparent);
  z-index: 2;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.visual-collage:hover .frame-mobile {
  transform: translate(-4px, -6px);
}

.frame-mobile__notch {
  height: 18px;
  background: var(--fx-surface-4);
  position: relative;
}
.frame-mobile__notch::after {
  content: '';
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 36%;
  height: 6px;
  border-radius: 4px;
  background: var(--fx-surface-5);
}

.frame-mobile__screen {
  position: relative;
  aspect-ratio: 9 / 16;
  overflow: hidden;
}

/* ── Project Images ─────────────────────────────────────── */
.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translateZ(0);
}

/* Subtle glitch on hover — RGB channel split */
.visual-collage:hover .frame-desktop__screen,
.visual-collage:hover .frame-mobile__screen {
  animation: img-glitch 0.3s steps(2, end) 1;
}

@keyframes img-glitch {
  0%   { clip-path: inset(0); filter: none; }
  20%  { clip-path: inset(8% 0 85% 0); filter: drop-shadow(3px 0 color-mix(in srgb, var(--fx-glow) 40%, transparent)) drop-shadow(-3px 0 color-mix(in srgb, var(--fx-magenta) 30%, transparent)); }
  40%  { clip-path: inset(60% 0 10% 0); filter: drop-shadow(-2px 0 color-mix(in srgb, var(--fx-cyan) 35%, transparent)) drop-shadow(2px 0 color-mix(in srgb, var(--fx-glow) 30%, transparent)); }
  60%  { clip-path: inset(30% 0 40% 0); filter: drop-shadow(2px 0 color-mix(in srgb, var(--fx-glow) 30%, transparent)); }
  80%  { clip-path: inset(0); filter: none; }
  100% { clip-path: inset(0); filter: none; }
}

.project-img--mobile {
  object-position: top center;
}

/* Persistent subtle scanline-flicker on hover */
.visual-collage:hover .frame-scanlines {
  animation: scanline-flicker 2s steps(4) infinite;
}

@keyframes scanline-flicker {
  0%, 100% { opacity: 1; }
  25%      { opacity: 0.6; }
  50%      { opacity: 0.9; }
  75%      { opacity: 0.5; }
}

/* Scanline overlay */
.frame-scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    var(--fx-scanline) 2px,
    var(--fx-scanline) 4px
  );
}

/* ── Divider ────────────────────────────────────────────── */
.project-divider {
  height: 1px;
  margin: 1rem 0 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--fx-line-strong) 30%, transparent) 20%,
    color-mix(in srgb, var(--fx-glow) 15%, transparent) 50%,
    color-mix(in srgb, var(--fx-line-strong) 30%, transparent) 80%,
    transparent 100%
  );
}

/* ── Scroll Progress Bar (vertical, right side) ─────────── */
.scroll-progress {
  position: absolute;
  right: -1.5rem;
  top: 0;
  bottom: 0;
  width: 3px;
  pointer-events: none;
  display: none;
}

@media (min-width: 768px) {
  .scroll-progress {
    display: block;
  }
}

.scroll-progress__track {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--fx-line) 25%, transparent);
  border-radius: 2px;
}

.scroll-progress__fill {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(
    180deg,
    var(--fx-glow) 0%,
    var(--fx-glow-soft) 100%
  );
  box-shadow: 0 0 10px color-mix(in srgb, var(--fx-glow) 40%, transparent);
  transform-origin: top;
  will-change: transform;
}

.scroll-progress__thumb {
  position: absolute;
  top: 0;
  left: 50%;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--fx-glow);
  border: 2px solid var(--fx-surface-2);
  box-shadow:
    0 0 8px color-mix(in srgb, var(--fx-glow) 60%, transparent),
    0 0 20px color-mix(in srgb, var(--fx-glow) 20%, transparent);
  will-change: transform;
}

/* ── Side Nav Dots ──────────────────────────────────────── */
.scroll-nav {
  position: absolute;
  left: -2.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: none;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .scroll-nav {
    display: flex;
  }
}

.scroll-nav__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  border: none;
  background: color-mix(in srgb, var(--fx-line-strong) 40%, transparent);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.scroll-nav__dot--active {
  width: 0.5rem;
  height: 1.25rem;
  border-radius: 9999px;
  background: var(--fx-glow);
  box-shadow: 0 0 10px color-mix(in srgb, var(--fx-glow) 50%, transparent);
}

.scroll-nav__dot:hover:not(.scroll-nav__dot--active) {
  background: color-mix(in srgb, var(--fx-glow) 60%, transparent);
  transform: scale(1.3);
}

/* ── Tech Chips ─────────────────────────────────────────── */
.tech-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-family: var(--font-mono);
  background: color-mix(in srgb, var(--fx-surface-4) 50%, transparent);
  border: 1px solid color-mix(in srgb, var(--fx-line-strong) 35%, transparent);
  color: var(--primary);
  white-space: nowrap;
  transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
}
.tech-chip:hover {
  border-color: color-mix(in srgb, var(--fx-glow) 50%, transparent);
  background: color-mix(in srgb, var(--fx-surface-5) 70%, transparent);
  box-shadow: 0 0 12px color-mix(in srgb, var(--fx-glow) 8%, transparent);
}

.tech-chip__icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  opacity: 0.8;
}
.tech-chip:hover .tech-chip__icon {
  opacity: 1;
}

.tech-chip__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary);
  flex-shrink: 0;
}

/* ── Project Links ──────────────────────────────────────── */
.project-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-family: var(--font-mono);
  border: 1px solid color-mix(in srgb, var(--fx-line-strong) 40%, transparent);
  background: color-mix(in srgb, var(--fx-surface-3) 60%, transparent);
  color: var(--fx-text-dim);
  text-decoration: none;
  transition: all 0.25s ease;
}
.project-link:hover {
  border-color: color-mix(in srgb, var(--fx-glow) 50%, transparent);
  color: var(--primary);
  box-shadow: 0 0 15px color-mix(in srgb, var(--fx-glow) 8%, transparent);
  transform: translateY(-1px);
}
.project-link--primary {
  border-color: color-mix(in srgb, var(--fx-line-strong) 50%, transparent);
  background: color-mix(in srgb, var(--fx-surface-4) 40%, transparent);
  color: var(--primary);
}
.project-link--primary:hover {
  background: color-mix(in srgb, var(--fx-surface-5) 60%, transparent);
  border-color: color-mix(in srgb, var(--fx-glow) 50%, transparent);
  color: var(--primary);
  box-shadow: 0 0 20px color-mix(in srgb, var(--fx-glow) 12%, transparent);
}
</style>
