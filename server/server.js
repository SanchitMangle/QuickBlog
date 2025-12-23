import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import authRouter from './routes/authRoutes.js';
import aiRouter from './routes/aiRoutes.js';
import interactionRouter from './routes/interactionRoutes.js';
import seoRouter from './routes/seoRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

// DB Connection
await connectDB()

// Middleware 
app.use(cors());
app.use(express.json())


// Routes

app.get('/', (req, res) => res.send('API WORKING'))
app.use('/', seoRouter); // Mount at root for /sitemap.xml
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/admin', adminRouter)
app.use('/api/blog', blogRouter)
app.use('/api/interactions', interactionRouter);
app.use('/api/users', userRouter);

// Error Handling
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server is running on PORT : ${PORT}`));
