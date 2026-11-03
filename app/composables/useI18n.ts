import { ref, computed } from 'vue'

export type Locale = 'en' | 'id'

const STORAGE_KEY = 'portfolio-locale'
const locale = ref<Locale>('en')

// ─── Translation dictionary ─────────────────────────────────
const dict = {
  // Hero
  heroGreeting: { en: "Hello, I'm", id: 'Halo, saya' },
  heroName: { en: 'Muhammad Fakhri Alauddin', id: 'Muhammad Fakhri Alauddin' },
  heroDesc: {
    en: 'Software Engineer with hands-on experience in backend and fullstack development, specializing in RESTful API design, relational database management, system integration, and web application development. Skilled in building scalable, efficient, and maintainable software solutions, with additional experience in IT system troubleshooting and IoT-based technologies.',
    id: 'Software Engineer yang memiliki pengalaman dalam pengembangan backend dan aplikasi web fullstack, khususnya dalam perancangan RESTful API, pengelolaan database relasional, integrasi sistem, serta pengembangan aplikasi berbasis web. Terbiasa membangun dan mengembangkan aplikasi yang efisien, mudah dikelola, dan dapat dikembangkan sesuai kebutuhan, serta memiliki pengalaman dalam menangani permasalahan teknis sistem IT dan pengembangan teknologi berbasis IoT.',
  },
  heroTagline: { en: '> Open to new opportunities_', id: '> Terbuka untuk peluang baru_' },
  heroViewProjects: { en: 'View Projects', id: 'Lihat Proyek' },
  heroMyResume: { en: 'My Resume', id: 'Resume Saya' },
  heroScrollToAbout: { en: 'Scroll to about', id: 'Gulir ke tentang' },

  // Navbar
  navAbout: { en: 'About', id: 'Tentang' },
  navProjects: { en: 'Projects', id: 'Proyek' },
  navSkills: { en: 'Skills', id: 'Keahlian' },
  navGuestBook: { en: 'Guest Book', id: 'Buku Tamu' },
  navContact: { en: 'Contact', id: 'Kontak' },

  // About
  aboutTitle: { en: 'About Me', id: 'Tentang Saya' },
  aboutSubtitle: { en: 'Get to know me better', id: 'Kenali saya lebih dekat' },
  aboutBio1: {
    en: "> Software Engineer with a Bachelor's degree in Computer Engineering Technology from IPB University and hands-on experience in backend development, fullstack web applications, and enterprise system development. Proficient in designing and developing RESTful APIs, managing relational databases, and building scalable applications using technologies such as NestJS, Laravel, Next.js, and JavaScript.",
    id: '> Saya merupakan lulusan Sarjana Terapan Teknologi Rekayasa Komputer dari IPB University yang memiliki pengalaman dalam pengembangan backend, aplikasi web fullstack, dan sistem informasi perusahaan. Memiliki kemampuan dalam merancang dan mengembangkan RESTful API, mengelola database relasional, serta membangun aplikasi menggunakan teknologi seperti NestJS, Laravel, Next.js, dan JavaScript.',
  },
  aboutBio2: {
    en: "Experienced in contributing to enterprise-level projects at AirNav Indonesia, including internal correspondence and event management systems, with involvement in system integration, CI/CD processes, and production deployments. Strong analytical thinking, problem-solving, and collaboration skills, with a commitment to writing maintainable code, optimizing system performance, and delivering reliable software solutions.",
    id: 'Selama berkontribusi di AirNav Indonesia, saya terlibat dalam pengembangan beberapa sistem internal perusahaan, termasuk aplikasi korespondensi dan manajemen kegiatan, mulai dari pengembangan fitur, integrasi sistem, hingga proses CI/CD dan deployment aplikasi ke server production. Saya terbiasa bekerja dalam tim, menganalisis kebutuhan sistem, serta menyelesaikan permasalahan teknis dengan pendekatan yang terstruktur. Saya juga memiliki komitmen untuk terus mengembangkan kemampuan dan menghasilkan solusi perangkat lunak yang efisien, mudah dikelola, dan sesuai dengan kebutuhan pengguna.',
  },
  aboutInternships: { en: '+ Internship Experiences', id: '+ Pengalaman Magang' },
  aboutBnspTitle: { en: 'BNSP Certified', id: 'Tersertifikasi BNSP' },
  aboutBnspDesc: {
    en: 'Certificate of Competence in Software Engineering & Hardware Installation Supervisor',
    id: 'Sertifikat Kompetensi Software Engineering & Hardware Installation Supervisor',
  },

  // Contributions
  contributionsTitle: { en: 'GitHub Activity', id: 'Aktivitas GitHub' },
  contributionsSubtitle: { en: 'My coding consistency over the past year', id: 'Konsistensi ngoding saya selama setahun terakhir' },
  contributionsViewProfile: { en: 'View Profile', id: 'Lihat Profil' },

  // Projects
  projectsTitle: { en: 'Projects', id: 'Proyek' },
  projectsSubtitle: { en: "Some things I've built", id: 'Beberapa hal yang pernah saya buat' },
  projectsBuiltWith: { en: 'Built with', id: 'Dibangun dengan' },
  projectsSource: { en: 'Source', id: 'Kode Sumber' },
  projectsLiveDemo: { en: 'Live Demo', id: 'Demo Langsung' },
  projectsCounter: { en: 'projects', id: 'proyek' },

  // Skills
  skillsTitle: { en: 'Skills', id: 'Keahlian' },
  skillsSubtitle: { en: 'Technologies I work with', id: 'Teknologi yang saya gunakan' },
  skillsTechnologies: { en: 'Technologies', id: 'Teknologi' },
  skillsProjects: { en: 'Projects', id: 'Proyek' },
  skillsInternships: { en: 'Internships', id: 'Magang' },
  skillsCertifications: { en: 'BNSP Certifications', id: 'Sertifikasi BNSP' },

  // Guest Book
  guestbookTitle: { en: 'Guest Book', id: 'Buku Tamu' },
  guestbookSubtitle: { en: 'Leave a message, say hello!', id: 'Tinggalkan pesan, sapa saya!' },
  guestbookLiveChat: { en: 'Live Chat', id: 'Chat Langsung' },
  guestbookConnected: { en: 'Connected', id: 'Terhubung' },
  guestbookConnecting: { en: 'Connecting...', id: 'Menghubungkan...' },
  guestbookEmpty: { en: 'No messages yet. Be the first to say hello!', id: 'Belum ada pesan. Jadilah yang pertama menyapa!' },
  guestbookReplyTo: { en: '↩ Reply to a message', id: '↩ Balasan ke pesan' },
  guestbookReply: { en: 'Reply', id: 'Balas' },
  guestbookReplyingTo: { en: 'Replying to', id: 'Membalas' },
  guestbookYourName: { en: 'Your name', id: 'Nama kamu' },
  guestbookTypeMessage: { en: 'Type a message...', id: 'Tulis pesan...' },
  guestbookPublicNote: { en: 'Messages are public and visible to everyone', id: 'Pesan bersifat publik dan terlihat semua orang' },

  // Contact
  contactTitle: { en: 'Contact', id: 'Kontak' },
  contactSubtitle: { en: "Let's get in touch", id: "Mari terhubung" },
  contactGetInTouch: { en: 'Get in Touch', id: 'Hubungi Saya' },
  contactIntro: {
    en: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out!",
    id: 'Saya selalu terbuka untuk mendiskusikan proyek baru, ide kreatif, atau peluang untuk menjadi bagian dari visi Anda. Jangan ragu untuk menghubungi!',
  },
  contactEmail: { en: 'Email', id: 'Email' },
  contactLocation: { en: 'Location', id: 'Lokasi' },
  contactSendTitle: { en: 'Send a Message', id: 'Kirim Pesan' },
  contactSendDesc: { en: "Fill out the form and I'll get back to you as soon as possible.", id: 'Isi formulirnya dan saya akan segera menghubungi kembali.' },
  contactName: { en: 'Name', id: 'Nama' },
  contactNamePlaceholder: { en: 'Your name', id: 'Nama kamu' },
  contactEmailPlaceholder: { en: 'your@email.com', id: 'email@kamu.com' },
  contactMessage: { en: 'Message', id: 'Pesan' },
  contactMessagePlaceholder: { en: 'Your message...', id: 'Pesan kamu...' },
  contactSending: { en: 'Sending...', id: 'Mengirim...' },
  contactSend: { en: 'Send Message', id: 'Kirim Pesan' },
  contactSuccess: { en: 'Thank you for your message! I will get back to you soon.', id: 'Terima kasih atas pesannya! Saya akan segera membalas.' },
  contactError: { en: 'Failed to send message. Please try again later.', id: 'Gagal mengirim pesan. Silakan coba lagi nanti.' },

  // Footer
  footerBuiltWith: { en: 'Built with', id: 'Dibangun dengan' },
  footerRights: { en: 'All rights reserved.', id: 'Hak cipta dilindungi.' },
} as const

export type TranslationKey = keyof typeof dict

export function useI18n() {
  const t = (key: TranslationKey): string => dict[key][locale.value]

  function initLocale() {
    const cookie = useCookie<Locale>('portfolio-locale')
    if (cookie.value === 'en' || cookie.value === 'id') {
      locale.value = cookie.value
    } else {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
      if (stored === 'en' || stored === 'id') {
        locale.value = stored
        cookie.value = stored
      }
    }
  }

  function toggleLocale() {
    locale.value = locale.value === 'en' ? 'id' : 'en'
    localStorage.setItem(STORAGE_KEY, locale.value)
    useCookie<Locale>('portfolio-locale').value = locale.value
  }

  const isIndonesian = computed(() => locale.value === 'id')

  return { locale, t, initLocale, toggleLocale, isIndonesian }
}