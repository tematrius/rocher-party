import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Event from '../models/Event.js';

const router = express.Router();

// Middleware d'authentification admin
const requireAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: { code: 401, message: 'Access denied' } });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: { code: 403, message: 'Admin access required' } });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: { code: 400, message: 'Invalid token' } });
  }
};

// POST /api/admin/login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Simple auth pour la démo (à remplacer par une vraie authentification)
    if (username === 'admin' && password === 'rocher2025') {
      const token = jwt.sign(
        { id: 'admin', username: 'admin', isAdmin: true },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        token,
        user: { id: 'admin', username: 'admin', isAdmin: true }
      });
    } else {
      res.status(401).json({ error: { code: 401, message: 'Invalid credentials' } });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: { code: 500, message: 'Server error' } });
  }
});

// POST /api/admin/events - Créer un nouvel événement
router.post('/admin/events', requireAdmin, async (req, res) => {
  try {
    const {
      name,
      slug,
      startAt,
      endAt,
      venue,
      program,
      menus,
      infos,
      isPublished = false
    } = req.body;

    // Vérifier que le slug est unique
    const existingEvent = await Event.findOne({ slug });
    if (existingEvent) {
      return res.status(400).json({ 
        error: { code: 400, message: 'Un événement avec ce slug existe déjà' } 
      });
    }

    // Trier le programme par ordre
    const sortedProgram = program ? program.map((step, index) => ({
      ...step,
      order: step.order || index + 1,
      completed: false
    })) : [];

    const newEvent = new Event({
      name,
      slug,
      startAt: new Date(startAt),
      endAt: endAt ? new Date(endAt) : null,
      venue: venue || {},
      program: sortedProgram,
      menus: menus || [],
      infos: infos || [],
      media: [],
      isPublished,
      // Only set createdBy if it's a valid ObjectId
      ...(mongoose.Types.ObjectId.isValid(req.user.id) && { createdBy: req.user.id })
    });

    await newEvent.save();

    console.log('✅ Nouvel événement créé:', name, 'slug:', slug);

    res.status(201).json({
      id: newEvent._id,
      name: newEvent.name,
      slug: newEvent.slug,
      startAt: newEvent.startAt,
      endAt: newEvent.endAt,
      venue: newEvent.venue,
      isPublished: newEvent.isPublished,
      programSteps: newEvent.program.length,
      completedSteps: 0
    });
  } catch (error) {
    console.error('Create event error:', error);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
      const errorMessages = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      return res.status(400).json({ 
        error: { 
          code: 400, 
          message: 'Données invalides', 
          details: errorMessages,
          fullError: error.message
        } 
      });
    }
    res.status(500).json({ error: { code: 500, message: 'Erreur serveur' } });
  }
});

// GET /api/admin/events - Liste tous les événements
router.get('/admin/events', requireAdmin, async (req, res) => {
  try {
    const events = await Event.find({}).sort({ createdAt: -1 });
    res.json(events.map(event => ({
      id: event._id,
      name: event.name,
      slug: event.slug,
      startAt: event.startAt,
      endAt: event.endAt,
      isPublished: event.isPublished,
      venue: event.venue,
      programSteps: event.program.length,
      completedSteps: event.program.filter(step => step.completed).length
    })));
  } catch (error) {
    console.error('Admin events error:', error);
    res.status(500).json({ error: { code: 500, message: 'Server error' } });
  }
});

// GET /api/admin/events/:slug - Détails complets d'un événement
router.get('/admin/events/:slug', requireAdmin, async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) {
      return res.status(404).json({ error: { code: 404, message: 'Event not found' } });
    }
    res.json(event);
  } catch (error) {
    console.error('Admin event details error:', error);
    res.status(500).json({ error: { code: 500, message: 'Server error' } });
  }
});

// DELETE /api/admin/events/:slug - Supprimer un événement
router.delete('/admin/events/:slug', requireAdmin, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ slug: req.params.slug });
    if (!event) {
      return res.status(404).json({ error: { code: 404, message: 'Événement non trouvé' } });
    }
    
    console.log(`🗑️ Événement supprimé: ${event.name} (${event.slug})`);
    res.json({ success: true, message: 'Événement supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression événement:', error);
    res.status(500).json({ error: { code: 500, message: 'Erreur serveur' } });
  }
});

// PUT /api/admin/events/:slug - Mettre à jour un événement complet
router.put('/admin/events/:slug', requireAdmin, async (req, res) => {
  try {
    const originalSlug = req.params.slug;
    const eventData = req.body;
    
    // Générer un nouveau slug si le nom a changé
    if (eventData.name) {
      eventData.slug = eventData.name.toLowerCase()
        .replace(/[àáâäã]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôöõ]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
    }

    // Vérifier si le nouveau slug n'existe pas déjà (sauf pour l'événement courant)
    if (eventData.slug && eventData.slug !== originalSlug) {
      const existingEvent = await Event.findOne({ slug: eventData.slug });
      if (existingEvent) {
        eventData.slug = `${eventData.slug}-${Date.now()}`;
      }
    }

    // Gérer le createdBy pour éviter l'erreur ObjectId
    if (eventData.createdBy && !mongoose.Types.ObjectId.isValid(eventData.createdBy)) {
      delete eventData.createdBy;
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { slug: originalSlug },
      eventData,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: { code: 404, message: 'Événement non trouvé' } });
    }

    console.log(`✏️ Événement modifié: ${updatedEvent.name} (${updatedEvent.slug})`);
    res.json({ 
      success: true, 
      message: 'Événement modifié avec succès',
      event: updatedEvent 
    });
  } catch (error) {
    console.error('Erreur modification événement:', error);
    
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ 
        error: { 
          code: 400, 
          message: 'Données invalides', 
          details: errorMessages,
          fullError: error.message
        } 
      });
    }
    res.status(500).json({ error: { code: 500, message: 'Erreur serveur' } });
  }
});

// PATCH /api/admin/events/:slug/program/:stepIndex - Marquer une étape comme terminée
router.patch('/admin/events/:slug/program/:stepIndex', requireAdmin, async (req, res) => {
  try {
    const { slug, stepIndex } = req.params;
    const { completed } = req.body;
    
    const event = await Event.findOne({ slug });
    if (!event) {
      return res.status(404).json({ error: { code: 404, message: 'Event not found' } });
    }
    
    const index = parseInt(stepIndex);
    if (index < 0 || index >= event.program.length) {
      return res.status(400).json({ error: { code: 400, message: 'Invalid step index' } });
    }
    
    event.program[index].completed = completed;
    if (completed) {
      event.program[index].completedAt = new Date();
    } else {
      event.program[index].completedAt = null;
    }
    
    await event.save();
    
    // Émettre via Socket.io pour mise à jour temps réel
    const io = req.app.get('io');
    if (io) {
      const updatedStep = event.program[index];
      const progressData = {
        stepIndex: index,
        step: updatedStep,
        totalSteps: event.program.length,
        completedSteps: event.program.filter(s => s.completed).length,
        completionRate: Math.round((event.program.filter(s => s.completed).length / event.program.length) * 100)
      };
      
      io.to(`event-${slug}`).emit('step-updated', progressData);
      console.log(`📡 Émission step-updated pour ${slug}:`, {
        stepTitle: updatedStep.title,
        completed: updatedStep.completed,
        completionRate: progressData.completionRate
      });
    }
    
    res.json(event.program[index]);
  } catch (error) {
    console.error('Admin update step error:', error);
    res.status(500).json({ error: { code: 500, message: 'Server error' } });
  }
});

// PATCH /api/admin/events/:slug/publish - Publier/dépublier un événement
router.patch('/admin/events/:slug/publish', requireAdmin, async (req, res) => {
  try {
    const { isPublished } = req.body;
    
    const event = await Event.updateOne(
      { slug: req.params.slug },
      { isPublished }
    );
    
    if (event.matchedCount === 0) {
      return res.status(404).json({ error: { code: 404, message: 'Event not found' } });
    }
    
    res.json({ success: true, isPublished });
  } catch (error) {
    console.error('Admin publish error:', error);
    res.status(500).json({ error: { code: 500, message: 'Server error' } });
  }
});

export default router;
