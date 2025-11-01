export class ApiResponseUtil {
  static success<T>(data: T, message = 'Success') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(message = 'Error', errors = [], statusCode = 500) {
    return {
      success: false,
      message,
      errors,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }
}