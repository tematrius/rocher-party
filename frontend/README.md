# Rocher Party Frontend

Frontend React pour l'application d'événements en temps réel.

## Démarrage

1. Installer les dépendances : `npm install`
2. Lancer le serveur de développement : `npm run dev`
3. Ouvrir http://localhost:3000

## Structure des routes

- `/event/:slug` - Page d'accueil de l'événement (compte à rebours ou navigation)
- `/event/:slug/menu` - Menu de l'événement
- `/event/:slug/program` - Programme en temps réel
- `/event/:slug/info` - Informations pratiques

## Fonctionnalités

- Compte à rebours synchronisé avec le serveur
- Affichage du programme en temps réel (Socket.io)
- Interface mobile responsive
- Gestion des états (verrouillé/déverrouillé)

## Configuration

Créer un fichier `.env` avec :
```
VITE_API_BASE=http://localhost:5000/api
```
