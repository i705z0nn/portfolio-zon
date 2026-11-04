<script setup lang="ts">
// Listens for the active pitch phase broadcast from the /pitch tab
// and auto-scrolls the home page to the related section.
const PHASE_SECTION: Record<string, string> = {
  intro: '#about',            // Perkenalan & Pendidikan → About Me
  experience: '#projects',    // Pengalaman Kerja & Proyek → Projects
  competence: '#skills',      // Kompetensi → Skills
  responsibility: '#about',  // Tugas & Tanggung Jawab → About Me
  closing: '#contact',        // Kontribusi & Penutup → Contact
}

let channel: BroadcastChannel | null = null

onMounted(() => {
  if (typeof BroadcastChannel === 'undefined') return

  channel = new BroadcastChannel('portfolio-pitch')

  channel.onmessage = (event) => {
    const data = event.data as { type: string; key: string | null }
    if (data?.type !== 'phase') return

    if (data.key) {
      const selector = PHASE_SECTION[data.key]
      const target = selector ? document.querySelector(selector) : null
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top, behavior: 'instant' })
      }
    }
  }
})

onUnmounted(() => {
  channel?.close()
})
</script>

<template>
  <!-- Invisible: only handles cross-tab auto-scroll -->
</template>
