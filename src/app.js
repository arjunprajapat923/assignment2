import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import schoolRoutes from './routes/schoolRoutes.js';

dotenv.config();

const app = express();



app.use(express.json());

// API routes
app.use('/api', schoolRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🔗 http://localhost:${PORT}`);
});