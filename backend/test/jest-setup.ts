import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

// Global Jest setup for NestJS testing
jest.setTimeout(30000);

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/learning_hub_test';

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at Promise:', reason);
});