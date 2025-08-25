import mongoose from 'mongoose';
import Event from './models/Event.js';

const debugEvents = async () => {
  try {
    await mongoose.connect('mongodb+srv://nolymashika21:7LIupTCVUjoKxU4T@cluster0.vropape.mongodb.net/rocher-party');
    
    console.log('=== DEBUG ÉVÉNEMENTS ===');
    
    // Chercher tous les événements
    const allEvents = await Event.find({});
    console.log(`🔢 Nombre d'événements total: ${allEvents.length}`);
    
    allEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.name}`);
      console.log(`   Slug: "${event.slug}"`);
      console.log(`   ID: ${event._id}`);
      console.log(`   isPublished: ${event.isPublished}`);
      console.log(`   startAt: ${event.startAt}`);
      console.log('---');
    });
    
    // Chercher spécifiquement test-mobile
    console.log('\n=== RECHERCHE SPÉCIFIQUE ===');
    const testEvent = await Event.findOne({ slug: 'test-mobile' });
    if (testEvent) {
      console.log('✅ test-mobile trouvé via findOne');
    } else {
      console.log('❌ test-mobile NOT FOUND via findOne');
    }
    
    // Test avec différentes méthodes
    const testEventById = await Event.findById('68ac6af68c165b8b7b657f37').catch(() => null);
    if (testEventById) {
      console.log('✅ Événement trouvé par ID');
      console.log('Slug de cet événement:', testEventById.slug);
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    await mongoose.disconnect();
  }
};

debugEvents();
