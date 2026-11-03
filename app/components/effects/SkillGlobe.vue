<script setup lang="ts">
import { Brain } from 'lucide-vue-next'

interface OrbitIcon {
  name: string
  icon: string
}

interface Props {
  icons?: OrbitIcon[]
  size?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 280,
  icons: () => [],
})

const isHovered = ref<number | null>(null)

// Compute positions for icons distributed around the globe
function getIconPosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  const radius = props.size * 0.58
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  return { x, y, angle }
}
</script>

<template>
  <div
    class="skill-globe-container"
    :style="{ width: `${size * 1.4}px`, height: `${size * 1.4}px` }"
  >
    <!-- Pulsing aura glow -->
    <div class="globe-aura" :style="{ width: `${size * 1.15}px`, height: `${size * 1.15}px` }" />

    <!-- Wireframe Globe -->
    <div class="globe-wrapper" :style="{ width: `${size}px`, height: `${size}px` }">
      <div class="globe-sphere">
        <!-- Latitude rings -->
        <div class="globe-ring globe-ring--equator" />
        <div class="globe-ring globe-ring--lat1" />
        <div class="globe-ring globe-ring--lat2" />
        <div class="globe-ring globe-ring--lat3" />
        <div class="globe-ring globe-ring--lat4" />
        <!-- Longitude rings -->
        <div class="globe-ring globe-ring--lon1" />
        <div class="globe-ring globe-ring--lon2" />
        <div class="globe-ring globe-ring--lon3" />
        <div class="globe-ring globe-ring--lon4" />
        <!-- Outer boundary -->
        <div class="globe-outline" />
        <!-- Grid dot pattern overlay -->
        <div class="globe-dots" />
      </div>

      <!-- Center content -->
      <div class="globe-center-content">
        <Brain class="mb-1.5 h-12 w-12 text-primary" :stroke-width="1.5" />
        <span class="text-[9px] font-retro tracking-[0.15em] text-primary retro-glow">EXPERIENCE</span>
        <span class="mt-0.5 text-[11px] font-display tracking-[0.2em] text-muted-foreground">DATABASE</span>
      </div>
    </div>

    <!-- Orbiting Tech Icons -->
    <div
      v-for="(item, i) in icons"
      :key="item.name"
      class="orbit-icon"
      :class="{
        'orbit-icon--hovered': isHovered === i,
        'orbit-icon--dimmed': isHovered !== null && isHovered !== i,
      }"
      :style="{
        transform: `translate(${getIconPosition(i, icons.length).x}px, ${getIconPosition(i, icons.length).y}px)`,
        animationDelay: `${i * 0.15}s`,
      }"
      @mouseenter="isHovered = i"
      @mouseleave="isHovered = null"
    >
      <div class="orbit-icon__inner">
        <Icon :name="item.icon" class="orbit-icon__svg" />
      </div>
      <span class="orbit-icon__label">{{ item.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.skill-globe-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── Globe Wireframe ────────────────────────────────────── */
.globe-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.globe-aura {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--fx-glow) 6%, transparent) 0%,
    color-mix(in srgb, var(--fx-glow) 3%, transparent) 40%,
    transparent 70%
  );
  animation: aura-pulse 4s ease-in-out infinite;
  pointer-events: none;
}

.globe-sphere {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  animation: globe-rotate 20s linear infinite;
  transform-style: preserve-3d;
  perspective: 800px;
}

.globe-outline {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--fx-line-strong) 50%, transparent);
  box-shadow:
    0 0 30px color-mix(in srgb, var(--fx-glow) 12%, transparent),
    0 0 80px color-mix(in srgb, var(--fx-glow) 6%, transparent),
    inset 0 0 50px color-mix(in srgb, var(--fx-surface-0) 60%, transparent),
    inset 0 0 15px color-mix(in srgb, var(--fx-glow) 8%, transparent);
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--fx-surface-2) 90%, transparent) 30%,
    color-mix(in srgb, var(--fx-surface-3) 75%, transparent) 60%,
    color-mix(in srgb, var(--fx-surface-1) 40%, transparent) 100%
  );
}

/* Grid dot pattern inside globe */
.globe-dots {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  overflow: hidden;
  opacity: 0.35;
  background-image: radial-gradient(circle, color-mix(in srgb, var(--fx-glow) 50%, transparent) 1px, transparent 1px);
  background-size: 14px 14px;
  mask-image: radial-gradient(circle, black 55%, transparent 70%);
  -webkit-mask-image: radial-gradient(circle, black 55%, transparent 70%);
}

/* Globe ring base */
.globe-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--fx-line-strong) 25%, transparent);
}

/* Equator — brighter */
.globe-ring--equator {
  transform: rotateX(90deg);
  border-color: color-mix(in srgb, var(--fx-glow) 35%, transparent);
}

/* Latitude lines */
.globe-ring--lat1 {
  inset: 15%;
  transform: rotateX(90deg);
}
.globe-ring--lat2 {
  inset: 30%;
  transform: rotateX(90deg);
}
.globe-ring--lat3 {
  inset: 45%;
  transform: rotateX(90deg);
  border-color: color-mix(in srgb, var(--fx-line-strong) 18%, transparent);
}
.globe-ring--lat4 {
  inset: 8%;
  transform: rotateX(90deg);
  border-color: color-mix(in srgb, var(--fx-line-strong) 12%, transparent);
}

/* Longitude lines */
.globe-ring--lon1 {
  transform: rotateY(0deg);
}
.globe-ring--lon2 {
  transform: rotateY(45deg);
}
.globe-ring--lon3 {
  transform: rotateY(90deg);
}
.globe-ring--lon4 {
  transform: rotateY(135deg);
  border-color: color-mix(in srgb, var(--fx-line-strong) 15%, transparent);
}

/* Globe center content */
.globe-center-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* ── Orbiting Icons ─────────────────────────────────────── */
.orbit-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s ease;
  animation: icon-float 4s ease-in-out infinite;
}

.orbit-icon--dimmed {
  opacity: 0.35;
}

.orbit-icon__inner {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: color-mix(in srgb, var(--fx-surface-4) 80%, transparent);
  border: 1px solid color-mix(in srgb, var(--fx-line-strong) 30%, transparent);
  backdrop-filter: blur(8px);
  transition:
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s,
    box-shadow 0.3s,
    background 0.3s;
}

.orbit-icon__svg {
  width: 22px;
  height: 22px;
  color: var(--fx-text-bright);
  transition: color 0.3s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.orbit-icon__label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--fx-text-label);
  white-space: nowrap;
  opacity: 0;
  transform: translateY(-4px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

/* Hover effects */
.orbit-icon--hovered .orbit-icon__inner {
  transform: scale(1.2);
  border-color: color-mix(in srgb, var(--fx-glow) 50%, transparent);
  box-shadow: 0 0 20px color-mix(in srgb, var(--fx-glow) 15%, transparent);
  background: color-mix(in srgb, var(--fx-surface-5) 95%, transparent);
}

.orbit-icon--hovered .orbit-icon__svg {
  color: var(--primary);
  transform: rotate(360deg);
}

.orbit-icon--hovered .orbit-icon__label {
  opacity: 1;
  transform: translateY(0);
  color: var(--primary);
}

/* ── Keyframes ──────────────────────────────────────────── */
@keyframes globe-rotate {
  from { transform: rotateY(0deg) rotateX(18deg); }
  to   { transform: rotateY(360deg) rotateX(18deg); }
}

@keyframes aura-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50%      { opacity: 1; transform: scale(1.06); }
}

@keyframes icon-float {
  0%, 100% { margin-top: 0; }
  50%      { margin-top: -6px; }
}
</style>
