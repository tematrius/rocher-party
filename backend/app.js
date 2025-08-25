import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import eventsRouter from './routes/events.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import uploadRouter from './routes/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://localhost:3001", 
    "http://192.168.137.1:3000",
    /^http:\/\/192\.168\.137\.\d+:3000$/
  ],
  credentials: true
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Log des requêtes pour debug
app.use('/uploads', (req, res, next) => {
  console.log(`📸 Requête image: ${req.path}`);
  next();
});

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', eventsRouter);
app.use('/api', authRouter);
app.use('/api', adminRouter);
app.use('/api/upload', uploadRouter);

export default app;
