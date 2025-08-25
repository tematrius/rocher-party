import mongoose from 'mongoose';
import Event from './models/Event.js';

const updateTestEvent = async () => {
  try {
    await mongoose.connect('mongodb+srv://nolymashika21:7LIupTCVUjoKxU4T@cluster0.vropape.mongodb.net/rocher-party');
    
    // Mettre à jour l'événement test-mobile pour qu'il soit déjà débloqué
    const result = await Event.updateOne(
      { slug: 'test-mobile' },
      { 
        startAt: new Date('2025-08-25T12:00:00Z'), // Dans le passé pour être débloqué
        endAt: new Date('2025-08-25T23:00:00Z'),
        isPublished: true
      }
    );

    if (result.matchedCount > 0) {
      console.log('✅ Événement test-mobile mis à jour avec succès!');
      console.log('🔗 URL: http://localhost:3001/event/test-mobile');
      
      // Vérifier l'événement
      const event = await Event.findOne({ slug: 'test-mobile' });
      const now = new Date();
      const locked = now < event.startAt || !event.isPublished;
      console.log('📅 Date de début:', event.startAt);
      console.log('📅 Date actuelle:', now);
      console.log('🔒 Verrouillé:', locked);
    } else {
      console.log('❌ Aucun événement trouvé avec le slug test-mobile');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    await mongoose.disconnect();
  }
};

updateTestEvent();
