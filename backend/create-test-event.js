import mongoose from 'mongoose';
import Event from './models/Event.js';

const createNewEvent = async () => {
  try {
    await mongoose.connect('mongodb+srv://nolymashika21:7LIupTCVUjoKxU4T@cluster0.vropape.mongodb.net/rocher-party');
    
    const newEvent = new Event({
      name: 'Soirée Test Mobile',
      slug: 'test-mobile',
      startAt: new Date('2025-08-26T20:00:00Z'),
      endAt: new Date('2025-08-26T23:00:00Z'),
      venue: {
        name: 'Salon de Test',
        address: '123 Rue de Test, Paris',
        googleMapsLink: 'https://maps.google.com'
      },
      isPublished: true,
      program: [
        {
          title: 'Accueil',
          description: 'Accueil des invités',
          order: 1,
          durationMin: 30
        },
        {
          title: 'Test Menu',
          description: 'Test du menu mobile',
          order: 2,
          durationMin: 30
        },
        {
          title: 'Fin',
          description: 'Fin des tests',
          order: 3,
          durationMin: 60
        }
      ],
      menus: [
        {
          name: 'Salade test',
          description: 'Une salade pour tester'
        },
        {
          name: 'Pizza responsive',
          description: 'Pizza qui s\'adapte à tous les écrans'
        }
      ]
    });

    await newEvent.save();
    console.log('✅ Nouvel événement créé avec succès!');
    console.log('🔗 URL: http://localhost:3000/event/test-mobile');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    await mongoose.disconnect();
  }
};

createNewEvent();
