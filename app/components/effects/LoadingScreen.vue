<script setup lang="ts">
const emit = defineEmits<{ done: [] }>()

const phase = ref(0)
// 0 = boot sequence
// 1 = spaceship warp
// 2 = fade out

const bootLines = ref<string[]>([])
const showCursor = ref(true)
const progressPct = ref(0)

const BOOT_MESSAGES = [
  '> SYSTEM BOOT v2.0.26 ...',
  '> Loading modules ............... OK',
  '> Compiling portfolio ........... OK',
  '> Calibrating warp drive ........ READY',
  '> LAUNCHING ...',
]

// Boot sequence typing (fast)
async function runBootSequence() {
  for (let i = 0; i < BOOT_MESSAGES.length; i++) {
    const msg = BOOT_MESSAGES[i]!
    bootLines.value.push('')
    for (let j = 0; j < msg.length; j++) {
      bootLines.value[bootLines.value.length - 1] = msg.slice(0, j + 1)
      await new Promise((r) => setTimeout(r, 4 + Math.random() * 6))
    }
    progressPct.value = Math.round(((i + 1) / BOOT_MESSAGES.length) * 100)
    await new Promise((r) => setTimeout(r, 40 + Math.random() * 60))
  }
}

// Spaceship warp phase
async function runWarpPhase() {
  phase.value = 1
  await new Promise((r) => setTimeout(r, 1000))
  phase.value = 2
  await new Promise((r) => setTimeout(r, 500))
  emit('done')
}

onMounted(async () => {
  await runBootSequence()
  await new Promise((r) => setTimeout(r, 150))
  await runWarpPhase()
})
</script>

<template>
  <Transition name="loader-exit">
    <div
      v-if="phase < 2"
      class="loading-screen"
      :class="{
        'loading-screen--warp': phase === 1,
      }"
    >
      <!-- Scanlines overlay -->
      <div class="loader-scanlines" />

      <!-- Center content -->
      <div class="loader-center" :class="{ 'loader-center--warp': phase === 1 }">
        <!-- Boot terminal -->
        <div v-if="phase === 0" class="boot-terminal">
          <div class="boot-header">
            <span class="boot-header__dot boot-header__dot--red" />
            <span class="boot-header__dot boot-header__dot--yellow" />
            <span class="boot-header__dot boot-header__dot--green" />
            <span class="boot-header__title">SYSTEM TERMINAL</span>
          </div>
          <div class="boot-body">
            <p
              v-for="(line, i) in bootLines"
              :key="i"
              class="boot-line"
              :class="{
                'boot-line--success': line.includes('OK') || line.includes('READY'),
                'boot-line--highlight': line.includes('NOMINAL') || line.includes('LAUNCHING'),
              }"
            >
              {{ line }}<span v-if="i === bootLines.length - 1 && showCursor" class="boot-cursor">█</span>
            </p>
          </div>

          <!-- Progress bar -->
          <div class="boot-progress">
            <div class="boot-progress__track">
              <div
                class="boot-progress__fill"
                :style="{ width: `${progressPct}%` }"
              />
            </div>
            <span class="boot-progress__text">{{ progressPct }}%</span>
          </div>
        </div>

        <!-- Warp speed effect (phase 1) -->
        <div v-if="phase === 1" class="warp-container">
          <!-- Spaceship silhouette -->
          <div class="spaceship">
            <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="spaceship-svg">
              <!-- Main body -->
              <path d="M10 30 L40 12 L100 18 L115 30 L100 42 L40 48 Z" fill="var(--fx-surface-4)" stroke="var(--fx-glow)" stroke-width="1.5"/>
              <!-- Cockpit window -->
              <ellipse cx="85" cy="30" rx="12" ry="7" fill="color-mix(in srgb, var(--fx-glow) 20%, var(--fx-surface-2))" stroke="var(--fx-glow)" stroke-width="1"/>
              <!-- Wing top -->
              <path d="M45 12 L60 2 L75 8 L60 15 Z" fill="var(--fx-surface-3)" stroke="var(--fx-glow-soft)" stroke-width="1"/>
              <!-- Wing bottom -->
              <path d="M45 48 L60 58 L75 52 L60 45 Z" fill="var(--fx-surface-3)" stroke="var(--fx-glow-soft)" stroke-width="1"/>
              <!-- Engine glow -->
              <circle cx="18" cy="30" r="5" fill="var(--fx-glow)" opacity="0.8"/>
              <circle cx="18" cy="30" r="8" fill="var(--fx-glow)" opacity="0.3"/>
              <!-- Engine trails -->
              <line x1="13" y1="30" x2="-20" y2="30" stroke="var(--fx-glow)" stroke-width="3" opacity="0.6"/>
              <line x1="13" y1="26" x2="-15" y2="24" stroke="var(--fx-cyan)" stroke-width="1.5" opacity="0.4"/>
              <line x1="13" y1="34" x2="-15" y2="36" stroke="var(--fx-cyan)" stroke-width="1.5" opacity="0.4"/>
            </svg>
          </div>
          <!-- Star streaks -->
          <div class="warp-stars">
            <div
              v-for="n in 40"
              :key="n"
              class="warp-star"
              :style="{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.4}s`,
                animationDuration: `${0.4 + Math.random() * 0.5}s`,
              }"
            />
          </div>
          <p class="warp-text retro-glow">ENTERING PORTFOLIO</p>
        </div>
      </div>

      <!-- Vignette -->
      <div class="loader-vignette" />
    </div>
  </Transition>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--fx-surface-0);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* ── Scanlines ──────────────────────────────────────────── */
.loader-scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    var(--fx-scanline) 2px,
    var(--fx-scanline) 4px
  );
}

/* ── Center Content ─────────────────────────────────────── */
.loader-center {
  position: relative;
  z-index: 10;
  width: 90%;
  max-width: 520px;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.4s ease;
}
.loader-center--warp {
  max-width: 600px;
}

/* ── Boot Terminal ──────────────────────────────────────── */
.boot-terminal {
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--fx-line-strong) 50%, transparent);
  background: color-mix(in srgb, var(--fx-surface-1) 92%, transparent);
  backdrop-filter: blur(12px);
  box-shadow:
    0 0 40px color-mix(in srgb, var(--fx-glow) 6%, transparent),
    0 0 0 1px color-mix(in srgb, var(--fx-line) 20%, transparent);
}

.boot-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: var(--fx-surface-3);
  border-bottom: 1px solid color-mix(in srgb, var(--fx-line) 30%, transparent);
}

.boot-header__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.boot-header__dot--red { background: hsl(0 60% 45%); }
.boot-header__dot--yellow { background: hsl(45 70% 50%); }
.boot-header__dot--green { background: var(--primary); }

.boot-header__title {
  margin-left: 8px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--muted-fg);
  letter-spacing: 0.08em;
}

.boot-body {
  padding: 1rem 1.25rem;
  min-height: 200px;
  max-height: 260px;
  overflow-y: auto;
  scrollbar-width: none;
}
.boot-body::-webkit-scrollbar { display: none; }

.boot-line {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  line-height: 1.7;
  color: var(--muted-fg);
  white-space: pre-wrap;
}
.boot-line--success {
  color: var(--primary);
}
.boot-line--highlight {
  color: var(--primary);
  text-shadow: 0 0 10px color-mix(in srgb, var(--fx-glow) 50%, transparent);
  font-weight: bold;
}

.boot-cursor {
  color: var(--primary);
  animation: blink 0.7s step-end infinite;
}

/* ── Progress Bar ───────────────────────────────────────── */
.boot-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid color-mix(in srgb, var(--fx-line) 30%, transparent);
  background: var(--fx-surface-2);
}

.boot-progress__track {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--fx-surface-5);
  overflow: hidden;
}

.boot-progress__fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--fx-glow-soft), var(--fx-glow));
  box-shadow: 0 0 10px color-mix(in srgb, var(--fx-glow) 50%, transparent);
  transition: width 0.2s ease-out;
}

.boot-progress__text {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--primary);
  min-width: 2.5rem;
  text-align: right;
}

/* ── Warp Phase ─────────────────────────────────────────── */
.warp-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  position: relative;
}

.spaceship {
  animation: ship-arrive 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards,
             ship-hover 2s ease-in-out 0.5s infinite;
}

.spaceship-svg {
  width: 140px;
  height: 70px;
  filter: drop-shadow(0 0 15px color-mix(in srgb, var(--fx-glow) 40%, transparent))
          drop-shadow(0 0 30px color-mix(in srgb, var(--fx-glow) 15%, transparent));
}

.warp-text {
  font-family: var(--font-retro);
  font-size: 0.85rem;
  color: var(--primary);
  letter-spacing: 0.2em;
  animation: text-flicker 0.15s ease-in-out 3;
}

/* Star streaks */
.warp-stars {
  position: absolute;
  inset: -100%;
  pointer-events: none;
}

.warp-star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--primary);
  border-radius: 50%;
  animation: star-streak linear forwards;
  box-shadow: 0 0 4px color-mix(in srgb, var(--fx-glow) 60%, transparent);
}

/* ── Vignette ───────────────────────────────────────────── */
.loader-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
  background: radial-gradient(ellipse at center, transparent 40%, color-mix(in srgb, var(--fx-surface-0) 60%, transparent) 100%);
}

/* ── Warp screen effect ─────────────────────────────────── */
.loading-screen--warp {
  background: var(--fx-surface-0);
}

/* ── Exit transition ────────────────────────────────────── */
.loader-exit-leave-active {
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.loader-exit-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

/* ── Keyframes ──────────────────────────────────────────── */
@keyframes blink {
  0%, 49.99% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

@keyframes ship-arrive {
  0% {
    opacity: 0;
    transform: translateX(-80px) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes ship-hover {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes star-streak {
  0% {
    transform: translateX(0) scaleX(1);
    opacity: 1;
  }
  100% {
    transform: translateX(-600px) scaleX(80);
    opacity: 0;
  }
}

@keyframes text-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
