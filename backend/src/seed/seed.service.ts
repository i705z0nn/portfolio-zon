import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExperienceType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seedExperiences() {
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
        company:
          'Dinas Ketahanan Pangan, Pertanian, dan Perikanan (DKP3) Kota Sukabumi',
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

    // Idempotent: wipe & re-create so re-running always reflects the CV data
    await this.prisma.experience.deleteMany({});
    for (const exp of experiences) {
      await this.prisma.experience.create({ data: exp });
    }
    return { seeded: experiences.length };
  }

  async seedAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await this.prisma.admin.upsert({
      where: { email: adminEmail },
      update: { password: hashedPassword },
      create: { email: adminEmail, password: hashedPassword, name: 'Admin' },
    });
    return { email: admin.email };
  }
}