import mongoose from 'mongoose';
import Event from './models/Event.js';

const checkEvents = async () => {
  try {
    await mongoose.connect('mongodb+srv://nolymashika21:7LIupTCVUjoKxU4T@cluster0.vropape.mongodb.net/rocher-party');
    
    console.log('=== Tous les événements dans la base ===');
    const allEvents = await Event.find({});
    console.log(`Nombre total d'événements: ${allEvents.length}`);
    
    allEvents.forEach(event => {
      console.log(`- ${event.name} (slug: ${event.slug})`);
      console.log(`  ID: ${event._id}`);
      console.log(`  isPublished: ${event.isPublished}`);
      console.log(`  startAt: ${event.startAt}`);
      console.log('---');
    });
    
    console.log('\n=== Recherche spécifique test-mobile ===');
    const testEvent = await Event.findOne({ slug: 'test-mobile' });
    if (testEvent) {
      console.log('✅ Événement test-mobile trouvé!');
      console.log('Détails:', JSON.stringify(testEvent, null, 2));
    } else {
      console.log('❌ Événement test-mobile non trouvé');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    await mongoose.disconnect();
  }
};

checkEvents();
