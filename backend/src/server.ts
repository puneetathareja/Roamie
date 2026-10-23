import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import postRoutes from './routes/postRoutes';
import authRoutes from './routes/authRoutes';
import bookmarkRoutes from './routes/bookmarkRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Roamie API running');
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});