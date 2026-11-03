<script setup lang="ts">
import { CalendarHeatmap } from 'vue3-calendar-heatmap'
import 'vue3-calendar-heatmap/dist/style.css'

interface ContributionDay {
  date: string
  count: number
  level: number
}

const props = withDefaults(defineProps<{
  username: string
}>(), {
  username: 'i705z0nn',
})

const contributions = ref<ContributionDay[]>([])
const totalContributions = ref(0)
const loading = ref(true)
const error = ref(false)

const { theme } = useTheme()

const endDate = computed(() => new Date())

const rangeColor = computed(() =>
  theme.value === 'light'
    ? [
        'hsl(80 25% 90%)',
        'hsl(150 45% 78%)',
        'hsl(150 60% 60%)',
        'hsl(150 75% 42%)',
        'hsl(150 85% 26%)',
      ]
    : [
        'hsl(120 12% 11% / 0.96)',
        'hsl(120 36% 24%)',
        'hsl(120 54% 36%)',
        'hsl(120 74% 50%)',
        'hsl(120 96% 68%)',
      ],
)

async function fetchContributions() {
  loading.value = true
  error.value = false

  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(props.username)}?y=last`)
    if (!res.ok) throw new Error('Failed to fetch')

    const data = await res.json()
    contributions.value = data.contributions.map((day: ContributionDay) => ({
      date: day.date,
      count: day.count,
    }))
    totalContributions.value = data.total?.lastYear ?? contributions.value.reduce((s: number, d: ContributionDay) => s + d.count, 0)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchContributions)
</script>

<template>
  <div class="github-calendar">
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="loading-pulse" />
      <span class="ml-3 text-sm text-muted-foreground font-mono">Loading contributions...</span>
    </div>

    <div v-else-if="error" class="py-8 text-center">
      <p class="text-sm text-muted-foreground font-mono">Failed to load GitHub contributions</p>
    </div>

    <div v-else class="calendar-wrapper">
      <ClientOnly>
        <CalendarHeatmap
          :values="contributions"
          :end-date="endDate"
          :range-color="rangeColor"
          :round="2"
          :max="20"
          :dark-mode="theme === 'dark'"
          no-data-text="No contributions"
          tooltip-unit="contributions"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.github-calendar {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--fx-line-strong) 40%, transparent) transparent;
}

.github-calendar::-webkit-scrollbar {
  height: 4px;
}

.github-calendar::-webkit-scrollbar-track {
  background: transparent;
}

.github-calendar::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--fx-line-strong) 40%, transparent);
  border-radius: 4px;
}

.calendar-wrapper {
  min-width: 680px;
}

.calendar-wrapper :deep(svg) {
  width: 100%;
  filter: saturate(1.08) contrast(1.12);
}

.calendar-wrapper :deep(text) {
  fill: var(--muted-fg) !important;
  font-family: var(--font-mono) !important;
  font-size: 10px !important;
}

.calendar-wrapper :deep(rect) {
  rx: 2;
  ry: 2;
  stroke: color-mix(in srgb, var(--fx-surface-0) 92%, transparent);
  stroke-width: 0.8px;
  filter: drop-shadow(0 0 3px color-mix(in srgb, var(--fx-glow) 8%, transparent));
}

.calendar-wrapper :deep(rect:hover) {
  stroke: color-mix(in srgb, var(--fx-glow) 82%, transparent);
  stroke-width: 1px;
  filter: drop-shadow(0 0 5px color-mix(in srgb, var(--fx-glow) 18%, transparent));
}

.loading-pulse {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary);
  animation: pulse-glow 1.4s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }

  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
