import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('/login', 'routes/auth/login.tsx'),
  route('/auth/callback', 'routes/auth/callback.tsx'),
  route('/logout', 'routes/auth/logout.tsx'),
  route('/dashboard', 'routes/dashboard.tsx'),
] satisfies RouteConfig;
