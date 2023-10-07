import { Injectable, type OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createSoftDeleteMiddleware } from 'prisma-soft-delete-middleware';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    this.$use(
      createSoftDeleteMiddleware({
        models: {
          User: true,
        },
        defaultConfig: {
          field: 'deletedAt',
          createValue: (deleted) => {
            if (deleted) return new Date();
            return null;
          },
          allowCompoundUniqueIndexWhere: true,
        },
      }),
    );

    await this.$connect();
  }
}
