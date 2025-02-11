import express, { Express } from 'express';

// Middlewares
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';
import compression from 'compression';
import { morgan } from './infraestructure/logger';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import jwtStrategy from './infraestructure/security/passport';
import authLimiter from './interface/middlewares/rateLimiter';

// Utils
import httpStatus from 'http-status';

// Config
import config from './config';
import ApiError from './domain/entities/apiError';

// Routes
import { routes } from './interface/routes';
import { errorConverter, errorHandler } from './interface/middlewares/error';

const app: Express = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security-related HTTP headers
app.use(helmet());

// enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
app.options('*', cors());

// parse and transform JSON request body
app.use(express.json());

// parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(ExpressMongoSanitize());

// gzip compression
app.use(compression());

// initialize passport for JWT authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
