import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

// Import routes
import userRoutes from './routes/userRoutes.js';
//import nftRoutes from './routes/nftRooutes';

// Import database connection
<<<<<<< HEAD
// import { dbClient } from './config/database.js';
//import { redisClient } from './config/redis';
=======
import connectDB from './config/database';
import redisClient from './config/redis';
>>>>>>> master

const app = express();
const port = process.env.PORT || '5000';

// Connect DB
connectDB();

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


/* use all routes from routes/ */
app.use('/api', userRoutes);

<<<<<<< HEAD
// When no route matches 
app.all('*', (req, res, next) => {
    return res.sendFile(path.join(path.resolve(), 'src/public', 'index.html'));
});
=======
/* use all routes from routes/index */
app.use('/api', userRoutes);
app.use('/api', nftRoutes);
>>>>>>> master

/* start the server */
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});

/* export app */
export default app;