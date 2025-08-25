import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.eventSlug = null;
  }

  connect() {
    if (!this.socket) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('🔌 Connecté au serveur Socket.io:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('🔌 Déconnecté du serveur Socket.io');
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Erreur de connexion Socket.io:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.eventSlug = null;
    }
  }

  joinEvent(slug) {
    if (!this.socket) {
      this.connect();
    }
    
    if (this.eventSlug !== slug) {
      this.eventSlug = slug;
      console.log('🎪 Tentative de rejoindre l\'événement:', slug);
      this.socket.emit('join-event', slug);
      console.log('📡 Commande join-event envoyée pour:', slug);
    }
  }

  onStepUpdate(callback) {
    if (!this.socket) return;
    console.log('👂 Écoute des mises à jour step-updated...');
    this.socket.on('step-updated', (data) => {
      console.log('📨 Événement step-updated reçu:', data);
      callback(data);
    });
  }

  offStepUpdate(callback) {
    if (!this.socket) return;
    this.socket.off('step-updated', callback);
  }

  // Écouter tous les événements pour debug
  onAny(callback) {
    if (!this.socket) return;
    this.socket.onAny(callback);
  }
}

// Instance singleton
export const socketService = new SocketService();
export default socketService;
