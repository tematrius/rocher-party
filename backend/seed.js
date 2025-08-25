import mongoose from 'mongoose';
import Event from './models/Event.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function createTestEvent() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    // Supprimer l'événement de test s'il existe déjà
    await Event.deleteOne({ slug: 'demo' });

    // Créer un nouvel événement de test
    const testEvent = new Event({
      name: 'Rocher Party Demo',
      slug: 'demo',
      startAt: new Date(Date.now() + 2 * 60 * 1000), // Dans 2 minutes pour tester le countdown
      endAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // Dans 4 heures
      venue: {
        name: 'Salle des Fêtes Demo',
        address: '123 Rue de la Demo, 75000 Paris',
        googleMapsLink: 'https://maps.google.com/?q=123+Rue+de+la+Demo+Paris',
        geo: { lat: 48.8566, lng: 2.3522 }
      },
      program: [
        {
          title: 'Accueil des invités',
          description: 'Arrivée et cocktail de bienvenue',
          order: 1,
          durationMin: 30,
          completed: false
        },
        {
          title: 'Discours d\'ouverture',
          description: 'Mot de bienvenue du maître de cérémonie',
          order: 2,
          durationMin: 15,
          completed: false
        },
        {
          title: 'Dîner',
          description: 'Service du repas principal',
          order: 3,
          durationMin: 90,
          completed: false
        },
        {
          title: 'Animation musicale',
          description: 'Musique et danse',
          order: 4,
          durationMin: 120,
          completed: false
        }
      ],
      menus: [
        {
          name: 'Cocktail de bienvenue',
          description: 'Champagne, jus d\'orange, amuse-bouches',
          tags: ['boisson', 'apéritif']
        },
        {
          name: 'Entrée',
          description: 'Salade de saumon fumé aux herbes fraîches',
          tags: ['entrée', 'poisson']
        },
        {
          name: 'Plat principal',
          description: 'Filet de bœuf aux champignons, légumes de saison',
          tags: ['plat', 'viande']
        },
        {
          name: 'Dessert',
          description: 'Tarte aux fruits rouges et crème vanillée',
          tags: ['dessert', 'sucré']
        }
      ],
      infos: [
        {
          key: 'dressCode',
          title: 'Code vestimentaire',
          content: 'Tenue de soirée recommandée. Évitez les tenues trop décontractées.'
        },
        {
          key: 'contacts',
          title: 'Contacts urgents',
          content: 'En cas d\'urgence, contactez le 06 12 34 56 78'
        }
      ],
      media: [],
      isPublished: true
    });

    await testEvent.save();
    console.log('Événement de test créé avec succès !');
    console.log('Slug:', testEvent.slug);
    console.log('URL frontend:', `http://localhost:3000/event/${testEvent.slug}`);

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    mongoose.disconnect();
  }
}

createTestEvent();
