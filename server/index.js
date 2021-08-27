import express, { response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import dotenv from 'dotenv';
import multer from 'multer';
import rTracer from 'cls-rtracer';
import bodyParser from 'body-parser';
import { connect } from '@database';
import { QueryRoot } from '@gql/queries';
import { MutationRoot } from '@gql/mutations';
import { isTestEnv, logger, unless } from '@utils/index';
import { signUpRoute, signInRoute } from '@server/auth';
import cluster from 'cluster';
import os from 'os';
import 'source-map-support/register';
import authenticateToken from '@server/middleware/authenticate/index';

// import redis from "redis";
// import session from 'express-session';
// import connectRedis from 'connect-redis';

const totalCPUs = os.cpus().length;

let app;
export const init = () => {
  // configure environment variables
  dotenv.config({ path: `.env.${process.env.ENVIRONMENT_NAME}` });

  // connect to database
  connect();

  // create the graphQL schema
  const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

  if (!app) {
    app = express();
  }

  // const RedisStore = connectRedis(session);
  // const redisClient = redis.createClient();

  app.use(express.json());
  app.use(rTracer.expressMiddleware());
  // app.use(
  //   session({
  //     name: 'qid',
  //     store: new RedisStore({ client: redisClient, disableTouch: true }),
  //     cookie: {
  //       maxAge: 1000 * 60 * 60 * 60 * 24,
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: 'lax'
  //     },
  //     saveUninitialized: false,
  //     secret: 'qwertyuiop',
  //     resave: false
  //   })
  // );

  //app.use(unless(authenticateToken, '/', '/sign-in', '/sign-up'));

  app.use(
    '/graphql',
    graphqlHTTP({
      schema: schema,
      graphiql: true,
      customFormatErrorFn: e => {
        logger().info({ e });
        return e;
      }
    })
  );

  const createBodyParsedRoutes = routeConfigs => {
    if (!routeConfigs.length) {
      return;
    }
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    const validate = configs => configs.every(({ path, handler, method }) => !!path && !!handler && !!method);
    try {
      if (validate(routeConfigs)) {
        routeConfigs.forEach(({ path, handler, method }) => app[method](path, multer().array(), handler));
      } else {
        throw new Error('Invalid route config');
      }
    } catch (error) {
      console.error(error);
    }
  };
  createBodyParsedRoutes([signUpRoute, signInRoute]);

  app.use('/', (req, res) => {
    const message = 'Service up and running!';
    logger().info(message);
    res.json(message);
  });

  /* istanbul ignore next */
  if (!isTestEnv()) {
    app.listen(9000);
  }
};

logger().info({ ENV: process.env.NODE_ENV });

if (!isTestEnv() && cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  init();
}

export { app };
