import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// GET /api/time
router.get('/time', (req, res) => {
  res.json({ now: new Date().toISOString() });
});

// GET /api/events/:slug/public
router.get('/events/:slug/public', async (req, res) => {
  try {
    console.log('🔍 Recherche événement avec slug:', req.params.slug);
    const event = await Event.findOne({ slug: req.params.slug });
    console.log('📅 Événement trouvé:', event ? 'OUI' : 'NON');
    if (event) {
      console.log('📋 Détails:', { name: event.name, slug: event.slug, isPublished: event.isPublished, startAt: event.startAt });
    }
    if (!event) return res.status(404).json({ error: { code: 404, message: 'Event not found' } });
    const now = new Date();
    const locked = now < event.startAt || !event.isPublished;
    console.log('🔒 État verrouillage:', { now, startAt: event.startAt, isPublished: event.isPublished, locked });
    res.json({
      id: event._id,
      name: event.name,
      slug: event.slug,
      startAt: event.startAt,
      venue: event.venue,
      locked,
      now,
      isPublished: event.isPublished,
    });
  } catch (error) {
    res.status(500).json({ error: { code: 500, message: 'Server error' } });
  }
});

// GET /api/events/:slug/full
router.get('/events/:slug/full', async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) return res.status(404).json({ error: { code: 404, message: 'Event not found' } });
    const now = new Date();
    const locked = now < event.startAt || !event.isPublished;
    if (locked) return res.status(403).json({ error: { code: 403, message: 'Event is locked' } });
    res.json({
      program: event.program,
      menus: event.menus,
      infos: event.infos,
      media: event.media,
      venue: event.venue,
      name: event.name,
      slug: event.slug,
      startAt: event.startAt,
      endAt: event.endAt,
    });
  } catch (error) {
    res.status(500).json({ error: { code: 500, message: 'Server error' } });
  }
});

export default router;
