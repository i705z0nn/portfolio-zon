<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  text: string
  speed?: number
  class?: string
  animateOnView?: boolean
  characters?: string
}

const props = withDefaults(defineProps<Props>(), {
  speed: 50,
  animateOnView: true,
  characters: '01アイウエオカキクケコ█▓░▒■□▲△▼▽◆◇○●$#@!?><{}[]|/\\=+-_~`^',
})

const displayText = ref(props.text.replace(/./g, ' '))
const containerRef = ref<HTMLElement | null>(null)
let scrambleInterval: ReturnType<typeof setInterval> | null = null
let hasScrambled = false

function scramble() {
  if (scrambleInterval) clearInterval(scrambleInterval)
  const original = props.text
  let iteration = 0

  scrambleInterval = setInterval(() => {
    displayText.value = original
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' '
        if (index < iteration) return original[index]
        return props.characters[Math.floor(Math.random() * props.characters.length)]
      })
      .join('')

    iteration += 1 / 3

    if (iteration >= original.length) {
      displayText.value = original
      if (scrambleInterval) clearInterval(scrambleInterval)
      scrambleInterval = null
    }
  }, props.speed)
}

// Re-scramble when text changes (e.g. language toggle)
watch(
  () => props.text,
  () => {
    if (hasScrambled) scramble()
  },
)

onMounted(() => {
  if (!props.animateOnView) {
    hasScrambled = true
    scramble()
    return
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        hasScrambled = true
        scramble()
        observer.disconnect()
      }
    },
    { threshold: 0.3 }
  )

  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
})

onUnmounted(() => {
  if (scrambleInterval) clearInterval(scrambleInterval)
})
</script>

<template>
  <span ref="containerRef" :class="props.class" class="font-mono">
    {{ displayText }}
  </span>
</template>
