# Zahngut Bad Wünnenberg - Zahnarztpraxis App

Eine Progressive Web App für Zahnarztpraxen mit Patienten-App und Admin-Panel.

## Quick Start

```bash
npm install
npm run dev
```

Öffne `setup-firebase.html` im Browser um die Datenbank zu initialisieren.

## Features

### Patienten-App
- Responsive Design (Mobile-First)
- Behandlungen mit detaillierten Informationen
- Öffnungszeiten und Kontaktinformationen
- Notfall-Informationen
- PWA (Installierbar auf allen Geräten)
- Offline-Funktionalität

### Admin-Panel
- Praxis-Grunddaten verwalten
- Behandlungen erstellen und bearbeiten
- Öffnungszeiten anpassen
- Notfall-Informationen bearbeiten
- Design-Einstellungen

## Setup

### 1. Firebase Datenbank erstellen

1. Gehe zu [Firebase Console](https://console.firebase.google.com/project/zahngut-app/firestore)
2. Erstelle eine Firestore Database im Testmodus
3. Region: `europe-west`
4. Setze Security Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 2. Datenbank initialisieren

Öffne `setup-firebase.html` im Browser und klicke auf "Datenbank jetzt initialisieren".

### 3. App starten

```bash
npm run dev
```

- **Hauptapp:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin-panel.html

## Deployment

### Build erstellen

```bash
npm run build
```

### Deployment zu Vercel

```bash
npm install -g vercel
vercel
```

Oder verbinde dein Git-Repository mit Vercel für automatisches Deployment.

### Deployment zu Netlify

1. Verbinde dein Git-Repository mit Netlify
2. Build Command: `npm run build`
3. Publish Directory: `dist`

## Technologie-Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Backend:** Firebase Firestore
- **Build Tool:** Vite
- **PWA:** Service Worker, Web App Manifest
- **Styling:** Custom CSS

## Browser-Support

- Chrome/Edge
- Safari (iOS & macOS)
- Firefox
- Opera
- Samsung Internet

## Lizenz

Proprietär - Alle Rechte vorbehalten
