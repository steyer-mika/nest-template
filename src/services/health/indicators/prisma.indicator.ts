import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  type HealthIndicatorResult,
} from '@nestjs/terminus';
import { type PrismaService } from '@/services/prisma/prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  /**
   * Check the health of the Prisma database connection.
   * @param key - The key to identify the health check.
   * @returns A health indicator result.
   */
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prismaService.$queryRaw`SELECT 1`; // Execute a simple query to check database connectivity
      return this.getStatus(key, true); // Return a successful health status
    } catch (e) {
      throw new HealthCheckError('Prisma check failed', e); // Throw an error if the health check fails
    }
  }
}
