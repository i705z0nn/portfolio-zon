<script setup lang="ts">
import type { ApiSkillCategory } from '~/composables/usePublicApi'

const { t } = useI18n()

const { fetchSkills, fetchExperiences } = usePublicApi()

const skillCategories = ref<ApiSkillCategory[]>([])
const totalSkills = ref(0)
const totalInternships = ref(0)
const totalCertifications = ref(0)
const isVisible = ref(false)
const sectionRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  try {
    const [skills, experiences] = await Promise.all([
      fetchSkills(),
      fetchExperiences(),
    ])
    skillCategories.value = skills
    totalSkills.value = skills.reduce((sum, cat) => sum + cat.skills.length, 0)
    totalInternships.value = experiences.filter(e => e.type === 'INTERNSHIP').length
    totalCertifications.value = experiences.filter(e => e.type === 'CERTIFICATION').length
  } catch (e) {
    console.error('Failed to fetch skills:', e)
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

const leftCategories = computed(() =>
  skillCategories.value.slice(0, Math.ceil(skillCategories.value.length / 2)),
)
const rightCategories = computed(() =>
  skillCategories.value.slice(Math.ceil(skillCategories.value.length / 2)),
)

function leftCatDelay(catIndex: number) {
  return catIndex * 200 + 300
}
function rightCatDelay(catIndex: number) {
  return (catIndex + leftCategories.value.length) * 200 + 300
}

// ── Tech logo icon mapping (skill name → simple-icons identifier) ──
const skillIconMap: Record<string, string> = {
  // Frontend
  'Vue.js': 'simple-icons:vuedotjs',
  'Nuxt.js': 'simple-icons:nuxtdotjs',
  'Next.js': 'simple-icons:nextdotjs',
  'React': 'simple-icons:react',
  'TypeScript': 'simple-icons:typescript',
  'JavaScript': 'simple-icons:javascript',
  'Tailwind CSS': 'simple-icons:tailwindcss',
  'HTML/CSS': 'simple-icons:html5',
  'HTML': 'simple-icons:html5',
  'CSS': 'simple-icons:css3',
  'Three.js': 'simple-icons:threedotjs',
  'GSAP': 'simple-icons:greensock',
  'Svelte': 'simple-icons:svelte',
  'Angular': 'simple-icons:angular',
  'Bootstrap': 'simple-icons:bootstrap',
  'Sass': 'simple-icons:sass',
  'Vite': 'simple-icons:vite',
  'Webpack': 'simple-icons:webpack',
  // Backend
  'NestJS': 'simple-icons:nestjs',
  'Node.js': 'simple-icons:nodedotjs',
  'Express': 'simple-icons:express',
  'Python': 'simple-icons:python',
  'FastAPI': 'simple-icons:fastapi',
  'Django': 'simple-icons:django',
  'REST API': 'simple-icons:openapiinitiative',
  'GraphQL': 'simple-icons:graphql',
  'Go': 'simple-icons:go',
  'Java': 'simple-icons:openjdk',
  'PHP': 'simple-icons:php',
  'Ruby': 'simple-icons:ruby',
  'Laravel': 'simple-icons:laravel',
  // Database
  'PostgreSQL': 'simple-icons:postgresql',
  'MySQL': 'simple-icons:mysql',
  'MongoDB': 'simple-icons:mongodb',
  'Firebase': 'simple-icons:firebase',
  'Prisma': 'simple-icons:prisma',
  'TypeORM': 'simple-icons:typeorm',
  'Redis': 'simple-icons:redis',
  'Supabase': 'simple-icons:supabase',
  'SQLite': 'simple-icons:sqlite',
  // DevOps / Tools
  'Docker': 'simple-icons:docker',
  'Kubernetes': 'simple-icons:kubernetes',
  'Git': 'simple-icons:git',
  'GitHub': 'simple-icons:github',
  'GitLab': 'simple-icons:gitlab',
  'Linux': 'simple-icons:linux',
  'Nginx': 'simple-icons:nginx',
  'AWS': 'simple-icons:amazonaws',
  'Vercel': 'simple-icons:vercel',
  'Netlify': 'simple-icons:netlify',
  'CI/CD': 'simple-icons:githubactions',
  // Design
  'Figma': 'simple-icons:figma',
  'Blender': 'simple-icons:blender',
  'Adobe XD': 'simple-icons:adobexd',
  // AI / ML
  'TensorFlow': 'simple-icons:tensorflow',
  'PyTorch': 'simple-icons:pytorch',
  'OpenAI': 'simple-icons:openai',
  'LangChain': 'simple-icons:langchain',
  'Machine Learning': 'simple-icons:scikitlearn',
  'Computer Vision': 'simple-icons:opencv',
  'YOLOv5': 'simple-icons:opencv',
  'Python ML': 'simple-icons:python',
  'Pandas': 'simple-icons:pandas',
  'NumPy': 'simple-icons:numpy',
  'Jupyter': 'simple-icons:jupyter',
  'Hugging Face': 'simple-icons:huggingface',
  // IoT & Embedded
  'Arduino': 'simple-icons:arduino',
  'ESP8266': 'simple-icons:esphome',
  'ESP32': 'simple-icons:esphome',
  'Raspberry Pi': 'simple-icons:raspberrypi',
  'Orange Pi': 'simple-icons:raspberrypi',
  'MQTT': 'simple-icons:mqtt',
  'Sensor Integration': 'simple-icons:homeassistant',
  'Home Assistant': 'simple-icons:homeassistant',
  'Zigbee': 'simple-icons:zigbee',
  // Mobile
  'Flutter': 'simple-icons:flutter',
  'React Native': 'simple-icons:react',
  'Swift': 'simple-icons:swift',
  'Kotlin': 'simple-icons:kotlin',
  'Dart': 'simple-icons:dart',
  'Expo': 'simple-icons:expo',
  // Testing
  'Jest': 'simple-icons:jest',
  'Cypress': 'simple-icons:cypress',
  'Vitest': 'simple-icons:vitest',
  // Cloud & Infra
  'Google Cloud': 'simple-icons:googlecloud',
  'Azure': 'simple-icons:microsoftazure',
  'DigitalOcean': 'simple-icons:digitalocean',
  'Cloudflare': 'simple-icons:cloudflare',
  // Misc
  'Postman': 'simple-icons:postman',
  'Swagger': 'simple-icons:swagger',
  'Markdown': 'simple-icons:markdown',
  'WebSocket': 'simple-icons:socketdotio',
  'RabbitMQ': 'simple-icons:rabbitmq',
  'Kafka': 'simple-icons:apachekafka',
  'Elasticsearch': 'simple-icons:elasticsearch',
  'Grafana': 'simple-icons:grafana',
  'Prometheus': 'simple-icons:prometheus',
}

function getSkillIcon(name: string): string | null {
  return skillIconMap[name] ?? null
}

// ── Pick representative icons for the globe orbit ──
const orbitIcons = computed(() => {
  const allSkills = skillCategories.value.flatMap(cat =>
    cat.skills.map(s => ({ name: s.name, icon: getSkillIcon(s.name) }))
  )
  // Pick skills that have icons, spread across categories (max ~10)
  const withIcons = allSkills.filter(s => s.icon !== null)
  const step = Math.max(1, Math.floor(withIcons.length / 10))
  const picked: { name: string; icon: string }[] = []
  for (let i = 0; i < withIcons.length && picked.length < 10; i += step) {
    const item = withIcons[i]
    if (item) picked.push({ name: item.name, icon: item.icon! })
  }
  return picked
})
</script>


<template>
  <section id="skills" ref="sectionRef" class="relative py-20 sm:py-32 overflow-hidden">
    <!-- Subtle radial ambient glow -->
    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute left-1/2 top-1/2 h-175 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
        style="background: radial-gradient(circle, color-mix(in srgb, var(--fx-glow) 8%, transparent) 0%, transparent 70%)"
      />
    </div>

    <!-- Ocean wave animation -->
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-48 overflow-hidden opacity-40">
      <svg class="wave-svg absolute bottom-0 w-full" viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path class="wave wave--1" d="M0,120 C240,180 480,60 720,120 C960,180 1200,60 1440,120 L1440,200 L0,200 Z" fill="color-mix(in srgb, var(--fx-glow) 12%, transparent)" />
        <path class="wave wave--2" d="M0,140 C240,100 480,180 720,140 C960,100 1200,180 1440,140 L1440,200 L0,200 Z" fill="color-mix(in srgb, var(--fx-cyan) 8%, transparent)" />
        <path class="wave wave--3" d="M0,155 C240,175 480,135 720,155 C960,175 1200,135 1440,155 L1440,200 L0,200 Z" fill="color-mix(in srgb, var(--fx-glow-soft) 15%, transparent)" />
      </svg>
    </div>

    <div class="container relative mx-auto max-w-7xl px-4">
      <!-- Stats row -->
      <div class="mb-14 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
        <div class="rounded-lg border border-primary/20 bg-card p-4 text-center shadow-sm retro-box-glow">
          <p class="text-2xl sm:text-3xl font-bold text-primary retro-glow">
            <EffectsCountUp :target="totalSkills" :duration="2000" suffix="+" />
          </p>
          <p class="text-xs sm:text-sm text-muted-foreground font-display">{{ t('skillsTechnologies') }}</p>
        </div>
        <div class="rounded-lg border border-primary/20 bg-card p-4 text-center shadow-sm retro-box-glow">
          <p class="text-2xl sm:text-3xl font-bold text-primary retro-glow">
            <EffectsCountUp :target="15" :duration="2000" suffix="+" />
          </p>
          <p class="text-xs sm:text-sm text-muted-foreground font-display">{{ t('skillsProjects') }}</p>
        </div>
        <div class="rounded-lg border border-primary/20 bg-card p-4 text-center shadow-sm retro-box-glow">
          <p class="text-2xl sm:text-3xl font-bold text-primary retro-glow">
            <EffectsCountUp :target="totalInternships" :duration="2000" suffix="+" />
          </p>
          <p class="text-xs sm:text-sm text-muted-foreground font-display">{{ t('skillsInternships') }}</p>
        </div>
        <div class="rounded-lg border border-primary/20 bg-card p-4 text-center shadow-sm retro-box-glow">
          <p class="text-2xl sm:text-3xl font-bold text-primary retro-glow">
            <EffectsCountUp :target="totalCertifications" :duration="2500" />
          </p>
          <p class="text-xs sm:text-sm text-muted-foreground font-display">{{ t('skillsCertifications') }}</p>
        </div>
      </div>

      <!-- ============ DESKTOP: Constellation layout ============ -->
      <div class="hidden lg:grid lg:min-h-140 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-10 xl:gap-14">
        <!-- Left column (right-aligned groups) -->
        <div class="flex flex-col gap-14 self-center">
          <div
            v-for="(cat, ci) in leftCategories"
            :key="cat.id"
            class="skills-group skills-group--left"
            :class="{ 'skills-group--visible': isVisible }"
            :style="{ transitionDelay: `${leftCatDelay(ci)}ms` }"
          >
            <div class="mb-3 flex flex-wrap justify-end gap-2.5">
              <span
                v-for="(skill, si) in cat.skills"
                :key="skill.id"
                class="skill-pill"
                :class="{ 'skill-pill--visible': isVisible }"
                :style="{ transitionDelay: `${leftCatDelay(ci) + si * 70 + 100}ms` }"
              >
                <span
                  v-if="si === 0"
                  class="skill-dot"
                  :style="{ background: cat.color, boxShadow: `0 0 6px ${cat.color}` }"
                />
                <Icon v-if="getSkillIcon(skill.name)" :name="getSkillIcon(skill.name)!" class="skill-icon" />
                {{ skill.name }}
              </span>
            </div>
            <p class="skills-category-label text-right">{{ cat.name }}</p>
          </div>
        </div>

        <!-- Center Globe -->
        <div
          class="center-globe-wrapper"
          :class="{ 'center-globe-wrapper--visible': isVisible }"
        >
          <EffectsSkillGlobe :icons="orbitIcons" :size="280" />
        </div>

        <!-- Right column (left-aligned groups) -->
        <div class="flex flex-col gap-14 self-center">
          <div
            v-for="(cat, ci) in rightCategories"
            :key="cat.id"
            class="skills-group skills-group--right"
            :class="{ 'skills-group--visible': isVisible }"
            :style="{ transitionDelay: `${rightCatDelay(ci)}ms` }"
          >
            <div class="mb-3 flex flex-wrap justify-start gap-2.5">
              <span
                v-for="(skill, si) in cat.skills"
                :key="skill.id"
                class="skill-pill"
                :class="{ 'skill-pill--visible': isVisible }"
                :style="{ transitionDelay: `${rightCatDelay(ci) + si * 70 + 100}ms` }"
              >
                <span
                  v-if="si === 0"
                  class="skill-dot"
                  :style="{ background: cat.color, boxShadow: `0 0 6px ${cat.color}` }"
                />
                <Icon v-if="getSkillIcon(skill.name)" :name="getSkillIcon(skill.name)!" class="skill-icon" />
                {{ skill.name }}
              </span>
            </div>
            <p class="skills-category-label">{{ cat.name }}</p>
          </div>
        </div>
      </div>

      <!-- ============ MOBILE / TABLET: Stacked layout ============ -->
      <div class="flex flex-col items-center gap-10 lg:hidden">
        <!-- Center Globe (smaller) -->
        <div
          class="center-globe-wrapper"
          :class="{ 'center-globe-wrapper--visible': isVisible }"
        >
          <EffectsSkillGlobe :icons="orbitIcons" :size="200" />
        </div>

        <!-- Category groups, stacked -->
        <div
          v-for="(cat, ci) in skillCategories"
          :key="cat.id"
          class="skills-group skills-group--mobile w-full max-w-sm"
          :class="{ 'skills-group--visible': isVisible }"
          :style="{ transitionDelay: `${ci * 150 + 200}ms` }"
        >
          <p class="skills-category-label mb-3 text-center">{{ cat.name }}</p>
          <div class="flex flex-wrap justify-center gap-2">
            <span
              v-for="(skill, si) in cat.skills"
              :key="skill.id"
              class="skill-pill"
              :class="{ 'skill-pill--visible': isVisible }"
              :style="{ transitionDelay: `${ci * 150 + si * 55 + 300}ms` }"
            >
              <span
                v-if="si === 0"
                class="skill-dot"
                :style="{ background: cat.color, boxShadow: `0 0 6px ${cat.color}` }"
              />
              <Icon v-if="getSkillIcon(skill.name)" :name="getSkillIcon(skill.name)!" class="skill-icon" />
              {{ skill.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Center Globe Wrapper ───────────────────────────────── */
.center-globe-wrapper {
  position: relative;
  opacity: 0;
  transform: scale(0.7);
  transition:
    opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.center-globe-wrapper--visible {
  opacity: 1;
  transform: scale(1);
}

/* ── Skill Pills ────────────────────────────────────────── */
.skill-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.15rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-family: var(--font-mono);
  background: color-mix(in srgb, var(--fx-surface-4) 75%, transparent);
  border: 1px solid color-mix(in srgb, var(--fx-line-strong) 35%, transparent);
  color: var(--fx-text-mid);
  white-space: nowrap;
  cursor: default;
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s,
    background 0.3s,
    box-shadow 0.3s;
}
.skill-pill--visible {
  opacity: 1;
  transform: translateY(0);
}
.skill-pill:hover {
  border-color: color-mix(in srgb, var(--fx-glow) 50%, transparent);
  background: color-mix(in srgb, var(--fx-surface-5) 90%, transparent);
  box-shadow: 0 0 18px color-mix(in srgb, var(--fx-glow) 7%, transparent);
  transform: translateY(-2px);
}

.skill-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ── Skill Icons ────────────────────────────────────────── */
.skill-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.3s;
}
.skill-pill:hover .skill-icon {
  opacity: 1;
}

/* ── Category Labels ────────────────────────────────────── */
.skills-category-label {
  font-family: var(--font-retro);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--fx-cyan);
}

/* ── Group Animations ───────────────────────────────────── */
.skills-group {
  opacity: 0;
  transition:
    opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}
.skills-group--left {
  transform: translateX(-24px);
}
.skills-group--right {
  transform: translateX(24px);
}
.skills-group--mobile {
  transform: translateY(20px);
}
.skills-group--visible {
  opacity: 1;
  transform: translate(0, 0);
}

/* ── Keyframes ──────────────────────────────────────────── */

/* ── Ocean Wave Animations ──────────────────────────────── */
.wave-svg {
  height: 200px;
  min-width: 100%;
}

.wave {
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  transform-origin: center bottom;
}

.wave--1 {
  animation: wave-drift 7s ease-in-out infinite;
}
.wave--2 {
  animation: wave-drift 11s ease-in-out infinite reverse;
}
.wave--3 {
  animation: wave-drift 5s ease-in-out infinite;
  animation-delay: -2s;
}

@keyframes wave-drift {
  0%   { d: path("M0,120 C240,180 480,60 720,120 C960,180 1200,60 1440,120 L1440,200 L0,200 Z"); }
  50%  { d: path("M0,140 C240,80 480,170 720,130 C960,70 1200,170 1440,140 L1440,200 L0,200 Z"); }
  100% { d: path("M0,120 C240,180 480,60 720,120 C960,180 1200,60 1440,120 L1440,200 L0,200 Z"); }
}
</style>
