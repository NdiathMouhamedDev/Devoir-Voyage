# Voyage de Touba

Application web pour planifier et gérer le voyage de Touba : consultation des horaires, inscription des pèlerins, notifications (email, WhatsApp), calendrier interactif.

## 🚀 Fonctionnalités

- Gestion des événements et plannings (hourlies)
- Inscription des utilisateurs aux horaires
- Calendrier interactif (FullCalendar)
- Notifications par email et WhatsApp (Ultramsg)
- Authentification sécurisée (Laravel Sanctum)
- Vérification d'email pour notifications en temps réel
- Interface moderne avec Tailwind CSS + daisyUI

## 🛠️ Tech Stack

**Backend**
- Laravel 12
- Laravel Sanctum + Breeze API
- SQLite
- Notifications: Mail, Database, Ultramsg (WhatsApp)

**Frontend**
- React + Vite
- Tailwind CSS + daisyUI
- FullCalendar
- Laravel Echo + Pusher

## 📦 Installation

### Backend

```bash
# Cloner le projet
git clone https://github.com/NdiathMouhamedDev/Devoir-Voyage.git
cd Backend

# Installer les dépendances
composer install

# Configuration
cp .env.example .env
php artisan key:generate

# Base de données
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## ⚙️ Configuration (.env)

```env
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=sqlite
DB_DATABASE=/path/to/database/database.sqlite

# Email (Gmail)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com

# Twilio (WhatsApp)
Ultramsg_SID=your-twilio-sid
Ultramsg_TOKEN=your-twilio-token
ULtramsg_WHATSAPP_FROM=whatsapp:+14155238886

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

## 🏃 Démarrage

**Backend:**
```bash
php artisan serve
php artisan queue:work
```

**Frontend:**
```bash
npm run dev
```

**Scheduler (pour notifications programmées):**
```bash
# Ajouter au crontab
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

## 📡 API Endpoints

### Authentification
- `POST /api/register` - Inscription
- `POST /api/login` - Connexion (retourne token)
- `POST /api/logout` - Déconnexion

### Événements
- `GET /api/events` - Liste des événements
- `POST /api/events` - Créer un événement
- `GET /api/events/{id}` - Détails d'un événement
- `PUT /api/events/{id}` - Modifier un événement
- `DELETE /api/events/{id}` - Supprimer un événement

### Horaires (Hourlies)
- `GET /api/hourly` - Liste des horaires
- `POST /api/hourly` - Créer un horaire
- `GET /api/hourly/{id}` - Détails d'un horaire
- `PUT /api/hourly/{id}` - Modifier un horaire
- `DELETE /api/hourly/{id}` - Supprimer un horaire

### Inscriptions
- `POST /api/inscriptions/{hourlyId}` - S'inscrire à un horaire
- `DELETE /api/inscriptions/{hourlyId}` - Se désinscrire

### Profil
- `GET /api/user` - Utilisateur connecté
- `POST /api/profile` - Mettre à jour le profil
- `POST /api/profile/password` - Changer le mot de passe

### Vérification Email
- `POST /api/send-verification` - Envoyer l'email de vérification
- `GET /api/email/verify/{id}/{hash}` - Vérifier l'email (lien signé)

## 🔔 Notifications

Le système envoie 3 notifications par inscription:
1. **Immédiate** - Confirmation d'inscription
2. **1 jour avant** - Rappel planifié
3. **30 minutes avant** - Dernier rappel

**Canaux:** Email, Database, WhatsApp (Ultramsg)

## 🐛 Problèmes Courants

**401 Unauthorized**
- Vérifier le header `Authorization: Bearer <token>`
- Configurer axios avec le token par défaut

**500 Internal Server Error**
- Consulter `storage/logs/laravel.log`
- Vérifier les champs requis (NOT NULL)
- Valider le format des numéros Twilio: `whatsapp:+221770000000`

**Invalid date (FullCalendar)**
- Utiliser le format ISO 8601: `new Date(h.startup).toISOString()`

**CORS /broadcasting/auth**
- Ajouter `FRONTEND_URL` dans `config/cors.php`
- Autoriser le header `Authorization`

**process is not defined (Vite)**
- Utiliser `import.meta.env.*` au lieu de `process.env`

## 📝 Structure de la Base de Données

**users** - Utilisateurs (+ role, phone, address, qr_code)  
**events** - Événements globaux  
**hourlies** - Plannings/horaires (liés aux events)  
**inscriptions** - Inscriptions des utilisateurs  
**notifications** - Historique des notifications

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT License
