import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import router from './routes/index.js';
import dbClient from './config/db.js';
import redisClient from './config/redis.js';

dotenv.config();

const app = express();
const port = process.env.PORT || '5000';

async function startServer() {
  try {
    /* Connect to MongoDB */
    await dbClient.connect();
    if (!dbClient.isAlive()) {
      throw new Error('Database connection failed');
    }

    /* Ensure Redis is ready */
    if (!redisClient.isAlive()) {
      throw new Error('Redis connection failed');
    }

    /* Middleware */
    app.use(helmet());
    app.use(
      cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
      })
    );

    const limiter = rateLimit({
      windowsMs: 15 * 60 * 1000,
      max: 100,
      message: 'Too many requests from this IP, please try again later.',
    });
    app.use(limiter);

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(morgan('combined'));

    /* Routes */
    app.use('/api', router);

    /* Start */
    app.listen(port, () => {
      console.log(`Server listening on port: ${port}`);
      console.log(`Database alive: ${dbClient.isAlive()}`);
      console.log(`Redis alive: ${redisClient.isAlive()}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;

