import mongoose from 'mongoose';
import Event from './models/Event.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function createCountdownTestEvent() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    // Supprimer l'événement de test s'il existe déjà
    await Event.deleteOne({ slug: 'countdown-test' });

    // Créer un nouvel événement de test avec compte à rebours de 5 minutes
    const testEvent = new Event({
      name: 'Test Compte à Rebours',
      slug: 'countdown-test',
      startAt: new Date(Date.now() + 5 * 60 * 1000), // Dans 5 minutes
      endAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // Dans 4 heures
      venue: {
        name: 'Lieu de Test',
        address: '123 Rue du Test, 75000 Paris',
        googleMapsLink: 'https://maps.google.com/?q=123+Rue+du+Test+Paris',
        geo: { lat: 48.8566, lng: 2.3522 }
      },
      program: [
        {
          title: 'Début de la soirée',
          description: 'Accueil et premiers échanges',
          order: 1,
          durationMin: 30,
          completed: false
        },
        {
          title: 'Présentation',
          description: 'Présentation du projet',
          order: 2,
          durationMin: 45,
          completed: false
        }
      ],
      menus: [
        {
          name: 'Apéritif de bienvenue',
          description: 'Cocktail signature et amuse-bouches',
          tags: ['apéritif', 'boisson']
        }
      ],
      infos: [
        {
          key: 'test',
          title: 'Information de test',
          content: 'Ceci est un test du compte à rebours. L\'événement se déverrouillera automatiquement dans 5 minutes.'
        }
      ],
      media: [],
      isPublished: true
    });

    await testEvent.save();
    console.log('Événement de test compte à rebours créé avec succès !');
    console.log('Slug: countdown-test');
    console.log('URL: http://localhost:3000/event/countdown-test');
    console.log('Se déverrouille dans 5 minutes...');

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    mongoose.disconnect();
  }
}

createCountdownTestEvent();
