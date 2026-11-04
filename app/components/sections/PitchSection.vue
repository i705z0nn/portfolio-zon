<script setup lang="ts">
const TOTAL_SECONDS = 300 // 5 minutes

interface Phase {
  key: string
  label: string
  start: number
  end: number
  script: string
}

// Paparan 5 menit — struktur sesuai ketentuan wawancara:
// pendidikan → pengalaman kerja → kompetensi → tugas & tanggung jawab → penutup
const phases: Phase[] = [
  {
    key: 'intro',
    label: 'Perkenalan & Pendidikan',
    start: 0,
    end: 45,
    script:
      'Selamat pagi, Bapak/Ibu. Perkenalkan, saya Muhammad Fakhri Alauddin, lulusan Sarjana Terapan Teknologi Rekayasa Komputer dari Sekolah Vokasi IPB University dengan IPK 3,48.\n\nSelama perkuliahan, saya mempelajari berbagai bidang teknologi informasi, khususnya Software Engineering, pemrograman web, database, dan jaringan komputer.\n\nDari beberapa bidang tersebut, saya memiliki ketertarikan lebih dalam pengembangan perangkat lunak, khususnya backend dan fullstack development. Ketertarikan tersebut kemudian saya kembangkan melalui beberapa proyek dan pengalaman kerja yang berkaitan langsung dengan pengembangan aplikasi.',
  },
  {
    key: 'experience',
    label: 'Pengalaman Kerja & Proyek',
    start: 45,
    end: 135,
    script:
      'Saya memiliki pengalaman sebagai Backend Developer Intern di AirNav Indonesia, di mana saya terlibat dalam pengembangan beberapa aplikasi internal perusahaan.\n\nSalah satu proyek yang saya kerjakan adalah NavEvent, yaitu aplikasi manajemen kegiatan yang membantu proses administrasi acara menjadi lebih terintegrasi dan efisien. Dalam proyek ini, saya berkontribusi pada pengembangan RESTful API, pengelolaan database, serta implementasi dan perbaikan fitur pada sisi backend menggunakan Laravel.\n\nSelain itu, saya juga terlibat dalam pengembangan kembali sistem korespondensi AirNav Indonesia menggunakan NestJS. Sistem ini digunakan untuk mendukung proses surat-menyurat perusahaan, seperti nota dinas, disposisi, dan surat dinas lainnya.\n\nPada proyek tersebut, tanggung jawab saya mencakup pengembangan API, implementasi proses bisnis ke dalam sistem, pengelolaan relasi database, integrasi dengan frontend, serta deployment aplikasi ke server.\n\nSebelumnya, saya juga memiliki pengalaman mengembangkan aplikasi website monitoring IoT menggunakan Next.js, JavaScript, dan Firebase. Proyek tersebut mengintegrasikan perangkat sensor dengan aplikasi web sehingga data dapat dipantau secara real-time.\n\nDari pengalaman tersebut, saya mendapatkan pemahaman mengenai bagaimana aplikasi dikembangkan, diintegrasikan, dan digunakan untuk mendukung kebutuhan operasional.',
  },
  {
    key: 'competence',
    label: 'Kompetensi',
    start: 135,
    end: 195,
    script:
      'Dari sisi kompetensi teknis, kemampuan utama saya berada pada pengembangan backend, khususnya menggunakan NestJS dan Laravel untuk membangun RESTful API serta mengimplementasikan proses bisnis aplikasi.\n\nSaya juga memiliki pengalaman dalam pengelolaan database relasional, mulai dari perancangan struktur tabel, pengelolaan relasi data, hingga pembuatan query untuk mendukung kebutuhan aplikasi.\n\nDari sisi frontend, saya memiliki pengalaman menggunakan Next.js dan JavaScript untuk mengembangkan antarmuka aplikasi web serta mengintegrasikannya dengan sumber data.\n\nSelain pengembangan aplikasi, saya juga memiliki pengalaman dalam penggunaan Git untuk version control, proses CI/CD, troubleshooting, dan deployment aplikasi.\n\nUntuk kompetensi nonteknis, saya terbiasa bekerja dalam tim, berkoordinasi terkait kebutuhan sistem, serta melakukan analisis dan penyelesaian masalah secara terstruktur.',
  },
  {
    key: 'responsibility',
    label: 'Tugas & Tanggung Jawab Fullstack',
    start: 195,
    end: 270,
    script:
      'Menurut pemahaman saya, seorang Software Engineer dengan fokus fullstack memiliki tanggung jawab dalam proses pengembangan aplikasi secara menyeluruh, mulai dari analisis kebutuhan, perancangan sistem, implementasi, pengujian, hingga pemeliharaan aplikasi.\n\nDari sisi frontend, tanggung jawabnya adalah membangun antarmuka yang mudah digunakan, responsif, serta dapat berkomunikasi dengan layanan backend.\n\nSedangkan dari sisi backend, tanggung jawabnya mencakup pengembangan API, implementasi business logic, pengelolaan database, serta memastikan keamanan dan keandalan layanan aplikasi.\n\nSelain itu, seorang Fullstack Software Engineer juga perlu memastikan integrasi antarkomponen berjalan dengan baik, melakukan debugging, serta mendukung proses deployment dan maintenance aplikasi.\n\nBerdasarkan pengalaman saya, pengembangan perangkat lunak tidak hanya berfokus pada penulisan kode, tetapi juga bagaimana memahami kebutuhan pengguna dan menerjemahkannya menjadi solusi yang dapat digunakan secara efektif.',
  },
  {
    key: 'closing',
    label: 'Kontribusi & Penutup',
    start: 270,
    end: 300,
    script:
      'Dengan latar belakang pendidikan dan pengalaman yang saya miliki, saya berharap dapat berkontribusi dalam pengembangan aplikasi perusahaan, baik dari sisi backend maupun frontend.\n\nSaya juga ingin terus mengembangkan kemampuan teknis, memperdalam pemahaman mengenai arsitektur sistem, serta berkontribusi dalam membangun aplikasi yang andal, efisien, dan mudah dikembangkan.\n\nDemikian paparan singkat dari saya. Terima kasih atas waktu dan kesempatan yang diberikan, Bapak/Ibu.',
  },
]

const elapsed = ref(0)
const isRunning = ref(false)
let timerId: ReturnType<typeof setInterval> | null = null

const remaining = computed(() => Math.max(0, TOTAL_SECONDS - elapsed.value))
const minutes = computed(() => String(Math.floor(remaining.value / 60)).padStart(2, '0'))
const seconds = computed(() => String(remaining.value % 60).padStart(2, '0'))
const progress = computed(() => (elapsed.value / TOTAL_SECONDS) * 100)
const isFinished = computed(() => elapsed.value >= TOTAL_SECONDS)

const currentPhase = computed(
  () =>
    phases.find(p => elapsed.value >= p.start && elapsed.value < p.end) ??
    phases[phases.length - 1]!,
)

// ── Cross-tab sync: broadcast active phase to other tabs (e.g. home page) ──
const pitchChannel = ref<BroadcastChannel | null>(null)

onMounted(() => {
  if (typeof BroadcastChannel !== 'undefined') {
    pitchChannel.value = new BroadcastChannel('portfolio-pitch')
  }
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
  pitchChannel.value?.close()
})

// Broadcast whenever the active phase changes
watch(currentPhase, (phase) => {
  pitchChannel.value?.postMessage({ type: 'phase', key: phase.key, label: phase.label })
})

watch(isRunning, (running) => {
  if (!running) {
    pitchChannel.value?.postMessage({ type: 'phase', key: null, label: null })
  }
})

function start() {
  if (isRunning.value || isFinished.value) return
  isRunning.value = true
  // Broadcast the current phase immediately on start
  pitchChannel.value?.postMessage({ type: 'phase', key: currentPhase.value.key, label: currentPhase.value.label })
  timerId = setInterval(() => {
    elapsed.value = Math.min(TOTAL_SECONDS, elapsed.value + 1)
    if (elapsed.value >= TOTAL_SECONDS) pause()
  }, 1000)
}

function pause() {
  isRunning.value = false
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

function reset() {
  pause()
  elapsed.value = 0
  pitchChannel.value?.postMessage({ type: 'phase', key: null, label: null })
}

// Manual jump: click a phase card to move the timer to that phase's start
function jumpToPhase(p: Phase) {
  elapsed.value = p.start
  pitchChannel.value?.postMessage({ type: 'phase', key: p.key, label: p.label })
}

function formatRange(p: Phase) {
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  return `${fmt(p.start)}–${fmt(p.end)}`
}
</script>

<template>
  <div class="py-16 sm:py-24">
    <div class="container mx-auto max-w-6xl px-4">
      <!-- Header -->
      <div class="mb-2 text-center">
        <h2 class="text-2xl font-bold tracking-tight">
          <EffectsGlitchText text="Interview Pitch" class="retro-glow" :continuous="false" intensity="low" />
        </h2>
      </div>
      <p class="mb-10 text-center text-muted-foreground font-display text-lg">
        <EffectsScrambledText text="Paparan singkat 5 menit — pendidikan, pengalaman, kompetensi, dan uraian tugas" :speed="40" />
      </p>

      <!-- Practice timer -->
      <div class="mx-auto mb-10 max-w-3xl rounded-lg border border-primary/20 bg-card/60 p-6 sm:p-8 backdrop-blur-sm shadow-sm retro-box-glow">
        <div class="flex flex-col items-center gap-4">
          <div class="flex items-baseline gap-2">
            <span class="font-retro text-4xl sm:text-5xl tabular-nums" :class="isFinished ? 'text-destructive retro-glow-magenta' : 'text-primary retro-glow'">
              {{ minutes }}:{{ seconds }}
            </span>
          </div>

          <!-- Progress bar -->
          <div class="w-full">
            <div class="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                class="h-full rounded-full bg-primary transition-all duration-500"
                :style="{ width: `${progress}%` }"
              />
            </div>
            <div class="mt-1.5 flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>0:00</span>
              <span>5:00</span>
            </div>
          </div>

          <!-- Phase chips -->
          <div class="flex flex-wrap justify-center gap-2">
            <span
              v-for="p in phases"
              :key="p.key"
              class="rounded-full border px-3 py-1 text-[10px] font-mono transition-all duration-300"
              :class="
                currentPhase.key === p.key
                  ? 'border-primary bg-primary/15 text-primary retro-glow'
                  : elapsed.value >= p.end
                    ? 'border-primary/30 bg-primary/5 text-muted-foreground'
                    : 'border-border text-muted-foreground'
              "
            >
              {{ p.label }}
            </span>
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-3">
            <button
              class="rounded-full border border-primary/40 bg-primary/10 px-6 py-2 text-xs font-retro uppercase tracking-widest text-primary transition-all hover:bg-primary/20 hover:shadow-[0_0_15px_var(--fx-glow)]"
              @click="isRunning ? pause() : start()"
            >
              {{ isRunning ? 'Pause' : isFinished ? 'Selesai' : 'Mulai Latihan' }}
            </button>
            <button
              class="rounded-full border border-border px-6 py-2 text-xs font-retro uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              @click="reset"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Phase cards -->
      <div class="grid gap-4 md:grid-cols-2">
        <button
          v-for="p in phases"
          :key="p.key"
          type="button"
          class="group rounded-lg border p-5 text-left transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
          :class="
            currentPhase.key === p.key
              ? 'border-primary/50 bg-primary/5 shadow-[0_0_20px_var(--fx-glow)]'
              : 'border-primary/20 bg-card/60 backdrop-blur-sm'
          "
          :aria-label="`Lompat ke fase ${p.label}`"
          @click="jumpToPhase(p)"
        >
          <div class="mb-3 flex items-center justify-between gap-2">
            <h3 class="font-retro text-[11px] uppercase tracking-wider" :class="currentPhase.key === p.key ? 'text-primary retro-glow' : 'text-foreground'">
              {{ p.label }}
            </h3>
            <span class="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
              {{ formatRange(p) }}
            </span>
          </div>
          <p class="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {{ p.script }}
          </p>
          <span
            class="mt-3 inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground/60 transition-colors group-hover:text-primary"
            :class="currentPhase.key === p.key ? 'text-primary' : ''"
          >
            ▶ {{ currentPhase.key === p.key ? 'Sedang berjalan' : 'Klik untuk lompat ke fase ini' }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>