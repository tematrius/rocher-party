# Rocher Party Backend

API REST + WebSocket pour la gestion d’événements en temps réel.

## Démarrage

1. Copier `.env.example` en `.env` et renseigner les variables.
2. Installer les dépendances : `npm install`
3. Lancer le serveur : `npm run dev`

## Modèles principaux
- Event
- User

## Routes principales
- GET `/api/time`
- GET `/api/events/:slug/public`
- GET `/api/events/:slug/full`
- POST `/api/auth/login`
