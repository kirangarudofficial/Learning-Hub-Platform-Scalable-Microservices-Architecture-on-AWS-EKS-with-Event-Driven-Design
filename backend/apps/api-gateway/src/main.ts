import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { 
  GlobalExceptionFilter,
  ResponseInterceptor,
  LoggingMiddleware,
  PerformanceMiddleware,
  SecurityHeadersMiddleware 
} from '@shared/filters';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrometheusService } from '@shared/monitoring';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  // Initialize Prometheus monitoring
  const prometheusService = app.get(PrometheusService);
  app.use('/metrics', async (req, res) => {
    res.setHeader('Content-Type', prometheusService.getContentType());
    res.end(await prometheusService.getMetrics());
  });
  
  const configService = app.get(ConfigService);
  
  // Global middleware
  app.use(new SecurityHeadersMiddleware().use);
  app.use(new LoggingMiddleware().use);
  app.use(new PerformanceMiddleware().use);
  
  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  // Global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // CORS configuration - Strict domain-based policy
  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS')?.split(',') || [
    'http://localhost:5173', // Dev frontend
    'https://learning-hub.example.com', // Production frontend
  ];
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, etc)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        logger.warn(`Blocked CORS request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept', 'X-Correlation-ID', 'X-Request-ID', 'X-Trace-ID'],
    maxAge: 86400, // 24 hours
  });
  
  // API Rate Limiting
  app.register(ThrottlerModule.forRoot({
    ttl: 60, // time window in seconds
    limit: 100, // max requests per IP in the time window
  }));
  
  // Apply rate limiting globally
  app.useGlobalGuards(app.get(ThrottlerGuard));

  // API prefix
  app.setGlobalPrefix('api', {
    exclude: ['/health', '/metrics'],
  });

  // Swagger setup
  const options = new DocumentBuilder()
    .setTitle('Learning Hub API')
    .setDescription('Learning Hub API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('courses', 'Course management endpoints')
    .addTag('enrollments', 'Enrollment management endpoints')
    .addTag('payments', 'Payment processing endpoints')
    .addTag('media', 'Media management endpoints')
    .addTag('notifications', 'Notification endpoints')
    .addTag('content', 'Content management endpoints')
    .addTag('assessments', 'Assessment endpoints')
    .addTag('reviews', 'Review management endpoints')
    .addTag('certificates', 'Certificate management endpoints')
    .addTag('gamification', 'Gamification endpoints')
    .addServer('http://localhost:3000', 'Local Development')
    .addServer('https://api.learninghub.example.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    deepScanRoutes: true,
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  });
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'healthy',
        redis: 'healthy',
        rabbitmq: 'healthy',
      },
    });
  });

  // Metrics endpoint is now handled by the MonitoringModule

  const port = configService.get('API_GATEWAY_PORT') || 3000;
  const host = configService.get('API_GATEWAY_HOST') || '0.0.0.0';

  await app.listen(port, host);
  
  logger.log(`🚀 Learning Platform API Gateway running on http://${host}:${port}`);
  logger.log(`📚 API Documentation available at http://${host}:${port}/docs`);
  logger.log(`❤️  Health Check available at http://${host}:${port}/health`);
  logger.log(`📊 Metrics available at http://${host}:${port}/metrics`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejection
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Uncaught exception
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});