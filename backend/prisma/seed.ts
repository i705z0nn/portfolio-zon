import { PrismaClient, ExperienceType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Create Admin ─────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
    },
  });
  console.log(`✅ Admin created: ${adminEmail}`);

  // ─── Seed Skill Categories ────────────────────────────
  const existingCategories = await prisma.skillCategory.count();
  if (existingCategories > 0) {
    console.log('⏭️  Skill categories already exist, skipping...');
  } else {
  const skillCategories = [
    {
      name: 'Frontend',
      icon: 'Monitor',
      color: 'rgba(59, 130, 246, 0.1)',
      order: 1,
      skills: ['Vue.js', 'Nuxt.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS'],
    },
    {
      name: 'Backend',
      icon: 'Server',
      color: 'rgba(16, 185, 129, 0.1)',
      order: 2,
      skills: ['NestJS', 'Node.js', 'Express', 'Python', 'REST API', 'GraphQL'],
    },
    {
      name: 'Database',
      icon: 'Database',
      color: 'rgba(245, 158, 11, 0.1)',
      order: 3,
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Prisma', 'TypeORM'],
    },
    {
      name: 'IoT & Embedded',
      icon: 'Cpu',
      color: 'rgba(239, 68, 68, 0.1)',
      order: 4,
      skills: ['ESP8266', 'Orange Pi', 'Arduino', 'Sensor Integration', 'MQTT'],
    },
    {
      name: 'AI & ML',
      icon: 'Brain',
      color: 'rgba(168, 85, 247, 0.1)',
      order: 5,
      skills: ['YOLOv5', 'Machine Learning', 'Computer Vision', 'Python ML'],
    },
    {
      name: 'DevOps & Tools',
      icon: 'Wrench',
      color: 'rgba(139, 92, 246, 0.1)',
      order: 6,
      skills: ['Git', 'Docker', 'CI/CD', 'Linux', 'Nginx', 'Vercel'],
    },
  ];

  for (const cat of skillCategories) {
    const { skills, ...categoryData } = cat;
    await prisma.skillCategory.create({
      data: {
        ...categoryData,
        skills: {
          create: skills.map((name) => ({ name })),
        },
      },
    });
  }
  console.log(`✅ ${skillCategories.length} skill categories seeded`);
  } // end else

  // ─── Seed Projects ────────────────────────────────────
  const existingProjects = await prisma.project.count();
  if (existingProjects > 0) {
    console.log('⏭️  Projects already exist, skipping...');
  } else {
  const projects = [
    {
      title: 'New Arsipku',
      description:
        'A modern correspondence system for AirNav Indonesia built with NestJS, improving performance, scalability, and maintainability for daily internal and external official communications.',
      tech: ['TypeScript', 'NestJS', 'MySQL', 'REST API'],
      github: 'https://github.com/mfakhria',
      image: '/new-arsipku.png',
      order: 1,
    },
    {
      title: 'NavEvent',
      description:
        'A digital platform for efficiency and transparency in managing AirNav Indonesia activities. Enables real-time paperless workflows, accelerated certificate distribution, and real-time dashboards.',
      tech: ['PHP', 'Laravel', 'MySQL', 'CI/CD'],
      github: 'https://github.com/mfakhria/be-navevent',
      image: '/nav-event.png',
      order: 2,
    },
    {
      title: 'HydroEye',
      description:
        'An automatic fish seed counting system using YOLOv5, Orange Pi Zero 3, and a static camera, achieving 95–97% detection accuracy with real-time monitoring and Google Sheets export.',
      tech: ['Python', 'YOLOv5', 'Tkinter', 'Machine Learning'],
      github: 'https://github.com/mfakhria/HydroEye',
      image: '/hydro-eye.jpg',
      order: 3,
    },
    {
      title: 'IoT Hydroponic Monitor',
      description:
        'An IoT-based website using JavaScript, Firebase, and Next.js to integrate hardware monitoring with a responsive web interface and real-time sensor data display via ESP8266.',
      tech: ['JavaScript', 'Next.js', 'Firebase', 'ESP8266'],
      github: 'https://github.com/mfakhria/monitoring_iot-main',
      image: '/iot-monitoring.png',
      order: 4,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log(`✅ ${projects.length} projects seeded`);
  } // end else

  // ─── Seed Experiences ─────────────────────────────────
  // Always refresh experiences from CV data (idempotent — safe to re-run)
  await prisma.experience.deleteMany({});
  const experiences = [
    {
      title: 'Backend Developer Intern',
      company: 'AirNav Indonesia',
      location: 'Kota Tangerang, Banten, Indonesia',
      startDate: new Date('2025-10-01'),
      endDate: null,
      description:
        'Designed and implemented RESTful APIs and CRUD modules to support business processes. Managed relational databases and supported CI/CD pipelines and production deployments. Contributed to NavEvent (real-time paperless event management) and the redevelopment of the AirNav correspondence system (New Arsipku) using NestJS.',
      type: ExperienceType.INTERNSHIP,
      order: 1,
    },
    {
      title: 'AI & IoT Developer Intern',
      company: 'Dinas Ketahanan Pangan, Pertanian, dan Perikanan (DKP3) Kota Sukabumi',
      location: 'Sukabumi, Indonesia',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2024-11-30'),
      description:
        'Developed an AI-powered fry counting system using YOLOv5, Orange Pi Zero 3, and a static camera, achieving 95–97% detection accuracy. Designed a user-friendly interface with Python and Tkinter enabling real-time monitoring, result export to Google Spreadsheet, and data sharing via WhatsApp.',
      type: ExperienceType.INTERNSHIP,
      order: 2,
    },
    {
      title: 'IoT Developer Intern',
      company: 'Joglo Kebun Wangi',
      location: 'Bogor, Indonesia',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-04-30'),
      description:
        'Developed an IoT-based website using JavaScript, Firebase, and Next.js to integrate hardware monitoring with a responsive web interface. Built a real-time database in Firebase and connected hardware devices via the ESP8266 microcontroller for seamless data transmission.',
      type: ExperienceType.INTERNSHIP,
      order: 3,
    },
    {
      title: 'Project Manager',
      company: 'Akselerate Indonesia (Nalar.Project)',
      location: 'Indonesia',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-06-30'),
      description:
        'As part of the Digital Future Leader program by @Akselerate.id, built and ran the Nalar.Project community. Organized the "AI Blueprint 101" educational webinar, involved from conceptualization, promotional materials, media partner collaboration, to hosting as MC.',
      type: ExperienceType.WORK,
      order: 4,
    },
    {
      title: 'Bachelor of Computer Engineering Technology',
      company: 'Institut Pertanian Bogor',
      location: 'Bogor, Indonesia',
      startDate: new Date('2021-08-01'),
      endDate: new Date('2025-08-31'),
      description:
        'GPA 3.48/4.00 — IPB Vocational School. Relevant courses: Website Programming, Software Engineering, Advanced Computer Networks, Embedded System, Machine Learning, IoT System Project. Final Project: Improving the Efficiency of Ornamental Fish Seed Counting through AI-Based Automation.',
      type: ExperienceType.EDUCATION,
      order: 5,
    },
    {
      title: 'Certificate of Competence in Software Engineering',
      company: 'BNSP',
      startDate: new Date('2024-06-01'),
      description: 'National Professional Certification in Software Engineering',
      type: ExperienceType.CERTIFICATION,
      order: 6,
    },
    {
      title: 'Hardware Installation Supervisor',
      company: 'BNSP',
      startDate: new Date('2024-06-01'),
      description:
        'National Professional Certification in Hardware Installation Supervision',
      type: ExperienceType.CERTIFICATION,
      order: 7,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log(`✅ ${experiences.length} experiences seeded`);

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
