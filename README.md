# 🎉 Rocher Party - Application de Gestion d'Événements

Application web complète pour organiser et gérer des événements avec interface administrative et suivi en temps réel.

## 🏗️ Architecture

- **Frontend** : React + Vite (déployé sur Netlify)
- **Backend** : Node.js + Express + Socket.io (déployé sur Railway) 
- **Database** : MongoDB Atlas
- **Déploiement** : Automatique via GitHub

## 🚀 Déploiement Automatique

### 1. Backend sur Railway

1. Connectez votre repository GitHub à Railway
2. Sélectionnez le dossier `/backend`
3. Railway détectera automatiquement le `package.json`
4. Variables d'environnement à configurer sur Railway :
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rocher-party
   JWT_SECRET=votre-secret-jwt-super-securise
   PORT=5000 (défini automatiquement par Railway)
   ```

### 2. Frontend sur Netlify

1. Connectez votre repository GitHub à Netlify
2. Configuration de build :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - **Base directory** : `frontend`

3. Variables d'environnement à configurer sur Netlify :
   ```
   VITE_API_URL=https://votre-app-backend.up.railway.app
   VITE_API_BASE=https://votre-app-backend.up.railway.app/api
   VITE_SOCKET_URL=https://votre-app-backend.up.railway.app
   ```

## 📁 Structure du Projet

```
rocher-party/
├── frontend/           # Application React
│   ├── src/
│   │   ├── components/ # Composants réutilisables
│   │   ├── pages/      # Pages de l'application
│   │   └── services/   # Services (Socket.io, etc.)
│   ├── .env           # Variables pour développement local
│   ├── .env.production # Variables pour production
│   └── netlify.toml   # Configuration Netlify
│
├── backend/            # API Node.js
│   ├── models/        # Modèles MongoDB
│   ├── routes/        # Routes API
│   ├── uploads/       # Images uploadées
│   ├── .env          # Variables d'environnement
│   └── railway.toml  # Configuration Railway
│
└── .github/
    └── workflows/     # GitHub Actions (CI/CD)
```

## 🛠️ Développement Local

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend  
```bash
cd frontend
npm install
npm run dev
```

## ✨ Fonctionnalités

### 👤 Interface Publique
- ✅ Affichage des événements en temps réel
- ✅ Programme avec étapes et progression
- ✅ Menu avec images des plats
- ✅ Interface mobile responsive

### 🔧 Interface Administrative
- ✅ Connexion sécurisée
- ✅ Dashboard avec statistiques
- ✅ Création d'événements complets
- ✅ Modification d'événements existants
- ✅ Suppression avec confirmation
- ✅ Gestion temps réel du programme
- ✅ Upload d'images pour les menus

### 🔄 Temps Réel
- ✅ Synchronisation Socket.io
- ✅ Mise à jour automatique des étapes
- ✅ Notifications instantanées

## 🎯 Utilisation

1. **Connexion admin** : `/admin/login` (identifiants par défaut : admin/admin123)
2. **Créer un événement** : Dashboard → "Nouvel événement"  
3. **Gérer en temps réel** : Dashboard → "Gérer" sur un événement
4. **Vue publique** : `/event/slug-de-votre-evenement`

## 🔒 Sécurité

- Authentication JWT
- Validation des données
- Protection CORS
- Upload sécurisé d'images
- Variables d'environnement

## 📱 Responsive

Interface optimisée pour :
- 📱 Mobile (320px+)
- 📱 Tablette (768px+) 
- 💻 Desktop (1024px+)

## 🤝 Contribution

1. Fork le projet
2. Créez votre branch (`git checkout -b feature/ma-fonctionnalite`)
3. Commit vos changements (`git commit -am 'Ajout de ma fonctionnalité'`)
4. Push sur la branch (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

---

🎊 **Prêt pour vos événements les plus mémorables !** 🎊
