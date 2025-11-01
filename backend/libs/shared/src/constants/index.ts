export const MICROSERVICE_TOKENS = {
  USER_SERVICE: 'USER_SERVICE',
  COURSE_SERVICE: 'COURSE_SERVICE',
  ENROLLMENT_SERVICE: 'ENROLLMENT_SERVICE',
  PAYMENT_SERVICE: 'PAYMENT_SERVICE',
  NOTIFICATION_SERVICE: 'NOTIFICATION_SERVICE',
  MEDIA_SERVICE: 'MEDIA_SERVICE',
} as const;

export const QUEUE_NAMES = {
  USER_QUEUE: 'user_queue',
  COURSE_QUEUE: 'course_queue',
  ENROLLMENT_QUEUE: 'enrollment_queue',
  NOTIFICATION_QUEUE: 'notification_queue',
  PAYMENT_QUEUE: 'payment_queue',
  MEDIA_QUEUE: 'media_queue',
} as const;

// Add RABBITMQ_QUEUES for backward compatibility
export const RABBITMQ_QUEUES = QUEUE_NAMES;

export const MICROSERVICE_QUEUES = QUEUE_NAMES;

export const REDIS_KEYS = {
  USER_CACHE: 'user_cache',
  COURSE_CACHE: 'course_cache',
} as const;

export const PATTERNS = {
  USER: {
    CREATE: 'create_user',
    UPDATE: 'update_user',
    DELETE: 'delete_user',
    FIND_ONE: 'find_user',
    FIND_ALL: 'find_users',
  },
  COURSE: {
    CREATE: 'create_course',
    UPDATE: 'update_course',
    DELETE: 'delete_course',
    FIND_ONE: 'find_course',
    FIND_ALL: 'find_courses',
  },
  ENROLLMENT: {
    CREATE: 'create_enrollment',
    UPDATE: 'update_enrollment',
    DELETE: 'delete_enrollment',
    FIND_ONE: 'find_enrollment',
    FIND_ALL: 'find_enrollments',
  },
  PAYMENT: {
    CREATE: 'create_payment',
    UPDATE: 'update_payment',
    DELETE: 'delete_payment',
    FIND_ONE: 'find_payment',
    FIND_ALL: 'find_payments',
  },
  NOTIFICATION: {
    CREATE: 'create_notification',
    UPDATE: 'update_notification',
    DELETE: 'delete_notification',
    REMOVE: 'delete_notification', // Alias for DELETE
    FIND_ONE: 'find_notification',
    FIND_ALL: 'find_notifications',
    SEND: 'send_notification',
    SEND_BULK: 'send_bulk_notifications',
    MARK_AS_READ: 'mark_notification_as_read',
    MARK_ALL_AS_READ: 'mark_all_notifications_as_read',
  },
  MEDIA: {
    UPLOAD: 'upload_media',
    DELETE: 'delete_media',
    FIND: 'find_media',
  }
} as const;

export const EVENT_PATTERNS = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  COURSE_CREATED: 'course.created',
  COURSE_UPDATED: 'course.updated',
  COURSE_PUBLISHED: 'course.published',
  ENROLLMENT_CREATED: 'enrollment.created',
  ENROLLMENT_COMPLETED: 'enrollment.completed',
  PAYMENT_PROCESSED: 'payment.processed',
  NOTIFICATION_SEND: 'notification.send',
} as const;

export const API_VERSIONS = {
  V1: 'v1',
  V2: 'v2',
} as const;

export const CORRELATION_ID_HEADER = 'X-Correlation-ID';
export const REQUEST_ID_HEADER = 'X-Request-ID';
export const TRACE_ID_HEADER = 'X-Trace-ID';