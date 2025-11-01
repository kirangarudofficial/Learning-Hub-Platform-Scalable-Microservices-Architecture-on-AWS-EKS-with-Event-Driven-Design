import { Module, Global } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { PrometheusService } from './monitoring/prometheus.service';
import { PrismaService } from './database/prisma.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { JwtStrategy } from './auth/jwt.strategy';
import { MetricsMiddleware } from './monitoring/metrics.middleware';
import { CircuitBreakerInterceptor } from './circuit-breaker/circuit-breaker.interceptor';
import { ApiResponseUtil } from './utils/api-response.util';

@Global()
@Module({
  imports: [
    DatabaseModule,
    MonitoringModule,
  ],
  providers: [
    JwtAuthGuard,
    RolesGuard,
    JwtStrategy,
    PrismaService,
    PrometheusService,
    CircuitBreakerInterceptor,
    ApiResponseUtil,
  ],
  exports: [
    DatabaseModule,
    MonitoringModule,
    JwtAuthGuard,
    RolesGuard,
    JwtStrategy,
    PrismaService,
    PrometheusService,
    CircuitBreakerInterceptor,
    ApiResponseUtil,
    MetricsMiddleware,
  ],
})
export class SharedModule {}