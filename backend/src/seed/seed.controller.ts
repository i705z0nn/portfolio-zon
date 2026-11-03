import { Controller, Post, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  /**
   * POST /api/seed/experiences
   * Protected by SEED_SECRET header — safe to call from Vercel/CI.
   * Idempotent: wipes & re-creates experiences from CV data.
   */
  @Post('experiences')
  async seedExperiences(@Headers('x-seed-secret') secret: string) {
    this.assertSecret(secret);
    return this.seedService.seedExperiences();
  }

  /**
   * POST /api/seed/admin
   * Upserts the admin account from ADMIN_EMAIL / ADMIN_PASSWORD env vars.
   */
  @Post('admin')
  async seedAdmin(@Headers('x-seed-secret') secret: string) {
    this.assertSecret(secret);
    return this.seedService.seedAdmin();
  }

  private assertSecret(secret: string) {
    const expected = process.env.SEED_SECRET;
    if (!expected || secret !== expected) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}