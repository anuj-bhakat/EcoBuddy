import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import creatorRoutes from './routes/creatorRoutes.js';
import greenPointsRoutes from './routes/greenPointsRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import challengeSubmissionRoutes from './routes/challengeSubmissionRoutes.js';
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/creator', creatorRoutes);
app.use('/api/greenpoints', greenPointsRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/challenge-submissions', challengeSubmissionRoutes);
app.use('/products', productRoutes);
app.use("/orders", orderRoutes);
app.use("/posts", postRoutes);

app.get('/', (req, res) => res.send('EcoBuddy backend API'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
