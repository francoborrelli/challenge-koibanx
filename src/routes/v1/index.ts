import express, { Router } from 'express';

// Config
import config from '../../config/config';

// Routes
import authRoute from './auth.route';
import userRoute from './user.route';
import docsRoute from './swagger.route';
import taskRoute from './uploadedTask.route';

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

/**
 * An array of route objects defining the default routes for the application.
 * Each route object contains a `path` and a `route` property.
 *
 * @type {IRoute[]}
 * @property {string} path - The URL path for the route.
 * @property {any} route - The route handler associated with the path.
 */
const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/tasks',
    route: taskRoute,
  },
];

/**
 * @constant
 * @name devIRoute
 * @type {IRoute[]}
 * @description
 * An array of route objects that are available only in development mode.
 * Each route object contains a `path` and a `route` property.
 *
 * @property {string} path - The URL path for the route.
 * @property {any} route - The route handler associated with the path.
 *
 * @example
 * // Example route object
 * {
 *   path: '/docs',
 *   route: docsRoute,
 * }
 */
const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
