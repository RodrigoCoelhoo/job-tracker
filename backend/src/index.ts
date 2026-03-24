/// <reference path="./types/express.d.ts" />
import 'dotenv/config';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import applicationRoutes from "./routes/application";
import { requireAuth } from './middlewares/auth.middleware';
import { apiLimiter } from './middlewares/ratelimiter.middleware';

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(apiLimiter);

app.use('/auth', authRoutes);
app.use('/applications', requireAuth, applicationRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Job Tracker API running"
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));