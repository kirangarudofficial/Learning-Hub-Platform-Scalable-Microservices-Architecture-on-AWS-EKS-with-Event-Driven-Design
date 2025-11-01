import { rest } from 'msw';

export const handlers = [
  // Auth handlers
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '1',
        email: 'user@example.com',
        name: 'Test User',
        role: 'student',
        token: 'mock-jwt-token'
      })
    );
  }),

  // Courses handlers
  rest.get('/api/courses', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          title: 'Introduction to React',
          description: 'Learn the basics of React',
          instructor: 'Jane Doe',
          price: 49.99,
          imageUrl: '/course1.jpg'
        },
        {
          id: '2',
          title: 'Advanced JavaScript',
          description: 'Master JavaScript concepts',
          instructor: 'John Smith',
          price: 69.99,
          imageUrl: '/course2.jpg'
        }
      ])
    );
  }),

  // User handlers
  rest.get('/api/users/me', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '1',
        email: 'user@example.com',
        name: 'Test User',
        role: 'student'
      })
    );
  })
];