import { type Prisma } from '@prisma/client';
import { createSoftDeleteMiddleware } from 'prisma-soft-delete-middleware';

export const prismaSoftDeleteMiddleware: Prisma.Middleware<unknown> =
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
  });
