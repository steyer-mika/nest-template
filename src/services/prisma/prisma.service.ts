import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { prismaSoftDeleteMiddleware } from './middleware/soft-delete';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    this.$use(prismaSoftDeleteMiddleware);

    Logger.log('PrismaService initialized', 'PrismaService');

    await this.$connect();

    Logger.log('PrismaClient connected', 'PrismaService');
  }

  async onModuleDestroy() {
    await this.$disconnect();

    Logger.log('PrismaClient disconnected', 'PrismaService');
  }
}
