import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/dashboard.tsx'),
  // authentication
  route('/login', 'routes/auth/login.tsx'),
  route('/auth/callback', 'routes/auth/callback.tsx'),
  route('/logout', 'routes/auth/logout.tsx'),
  // dashboard
  route('/flashcards', 'routes/flashcards.tsx'),
  route('/flashcards/:id/play', 'routes/flashcards/play.tsx'),
] satisfies RouteConfig;
