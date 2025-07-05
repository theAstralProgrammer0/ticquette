import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

// Import routes
import userRoutes from './routes/userRoutes';
import nftRoutes from './routes/nftRooutes';

// Import database connection
import { dbClient } from './config/database';
import { redisClient } from './config/redis';


// create express app
const app = express();

// define port
const port = process.env.PORT || '5000';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

/* define rate limiting and register it */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15mins
  max: 100, // limit each IP to 100 reqs. per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

/* register middleware to parse incoming json request body to populate
 * req.body */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

//


/* use all routes from routes/index */
app.use(routes);

/* start the server */
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});

/* export app */
export default app;


