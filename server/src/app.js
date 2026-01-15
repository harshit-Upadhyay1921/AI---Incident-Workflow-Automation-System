import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CORS_ORIGIN,
];
app.use(cors({
    origin: allowedOrigins[1],
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