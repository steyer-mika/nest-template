import { Injectable, type OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { prismaSoftDeleteMiddleware } from './middleware/soft-delete';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    this.$use(prismaSoftDeleteMiddleware);

    await this.$connect();
  }
}
