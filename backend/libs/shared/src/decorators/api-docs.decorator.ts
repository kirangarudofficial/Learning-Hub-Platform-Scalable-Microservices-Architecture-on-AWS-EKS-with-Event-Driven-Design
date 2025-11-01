import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function ApiEndpoint(options: {
  summary: string;
  description?: string;
  tags: string[];
  successStatus?: number;
  successDescription?: string;
  successType?: any;
  errorResponses?: Array<{
    status: number;
    description: string;
    type?: any;
  }>;
}) {
  const {
    summary,
    description,
    tags,
    successStatus = 200,
    successDescription = 'Success',
    successType,
    errorResponses = [],
  } = options;

  const decorators = [
    ApiOperation({
      summary,
      description,
    }),
    ApiTags(...tags),
    ApiResponse({
      status: successStatus,
      description: successDescription,
      type: successType,
    }),
  ];

  // Add standard error responses
  const standardErrors = [
    {
      status: 400,
      description: 'Bad Request - Invalid input data',
    },
    {
      status: 401,
      description: 'Unauthorized - Authentication required',
    },
    {
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    },
    {
      status: 404,
      description: 'Not Found - Resource not found',
    },
    {
      status: 429,
      description: 'Too Many Requests - Rate limit exceeded',
    },
    {
      status: 500,
      description: 'Internal Server Error',
    },
  ];

  // Combine custom error responses with standard ones
  const allErrorResponses = [...errorResponses, ...standardErrors];

  // Add all error responses
  allErrorResponses.forEach((error) => {
    decorators.push(
      ApiResponse({
        status: error.status,
        description: error.description,
      }),
    );
  });

  return applyDecorators(...decorators);
}