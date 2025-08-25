import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: [
      "http://localhost:3000", 
      "http://localhost:3001", 
      "http://192.168.137.1:3000",
      /^http:\/\/192\.168\.137\.\d+:3000$/
    ], 
    methods: ["GET", "POST"]
  } 
});

// Rendre io disponible pour les autres modules
app.set('io', io);

// Gestion des connexions Socket.io
io.on('connection', (socket) => {
  console.log('👤 Client connecté:', socket.id);
  
  // Rejoindre une room spécifique à un événement
  socket.on('join-event', (eventSlug) => {
    socket.join(`event-${eventSlug}`);
    console.log(`🎪 Client ${socket.id} a rejoint l'événement: ${eventSlug}`);
  });
  
  socket.on('disconnect', () => {
    console.log('👋 Client déconnecté:', socket.id);
  });
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rocherparty';
mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`Socket.io ready for real-time updates`);
});
