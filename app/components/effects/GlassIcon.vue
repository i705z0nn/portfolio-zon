<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  icon: Component
  color?: string
  size?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: '',
  size: 48,
})
</script>

<template>
  <div
    :class="props.class"
    class="glass-icon group relative inline-flex shrink-0 items-center justify-center rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/10"
    :style="{
      width: `${size + 24}px`,
      height: `${size + 24}px`,
      minWidth: `${size + 24}px`,
      minHeight: `${size + 24}px`,
      background: color || 'var(--fx-glass)',
      borderColor: 'var(--fx-glass-border)',
    }"
  >
    <component
      :is="icon"
      :size="size * 0.55"
      class="text-foreground transition-transform duration-300 group-hover:scale-110"
    />
    <!-- Glass reflection -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <div
        class="absolute -top-1/2 left-0 h-full w-full bg-linear-to-b to-transparent transition-transform duration-500 group-hover:-translate-y-1"
      />
    </div>
  </div>
</template>
