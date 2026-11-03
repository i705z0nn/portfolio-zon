<script setup lang="ts">
interface Props {
  spotlightX?: number
  spotlightY?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  spotlightX: 0,
  spotlightY: 0,
})

const cardRef = ref<HTMLElement | null>(null)

const spotlightStyle = computed(() => {
  if (!cardRef.value) return {}
  const rect = cardRef.value?.getBoundingClientRect()
  if (!rect) return {}
  const x = props.spotlightX - rect.left
  const y = props.spotlightY - rect.top
  return {
    background: `radial-gradient(400px circle at ${x}px ${y}px, var(--fx-spotlight), transparent 40%)`,
  }
})
</script>

<template>
  <div
    ref="cardRef"
    :class="props.class"
    class="chroma-card group relative overflow-hidden rounded-xl border bg-card transition-all duration-300"
  >
    <div
      class="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
      :style="spotlightStyle"
    />
    <div
      class="pointer-events-none absolute inset-0 z-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style="box-shadow: inset 0 0 0 1px var(--fx-glass-border)"
    />
    <slot />
  </div>
</template>
