import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CORS_ORIGIN,
  "https://incidentiq.vercel.app",
  // Add any other preview URLs if needed
].filter(Boolean); // Remove undefined values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))
app.use(express.json());
app.use(express.urlencoded())
app.use(express.static('public'))
app.use(cookieParser())

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import incidentRoutes from "./routes/incident.routes.js";

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/incidents",incidentRoutes);

export {app};