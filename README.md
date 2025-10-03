# Zahngut Bad Wünnenberg - Zahnarztpraxis PWA

Eine vollständige Progressive Web App für eine Zahnarztpraxis mit Patienten-App und Admin-Panel.

## ⚡ Quick Start

```bash
npm install
npm run dev
```

**Die App funktioniert sofort mit Mock-Daten!**

## 📚 Documentation

- **🚀 [GETTING_STARTED.md](./GETTING_STARTED.md)** - Start here! Complete beginner's guide
- **🗄️ [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Connect to real database (15 min)
- **🌐 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deploy to Vercel for production (10 min)

## Current Status

✅ **Working with mock data** - Test immediately without setup
⚠️ **For production** - Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to connect database

## Features

### Patienten-App
- ✅ Responsive Design (Mobile-First)
- ✅ Behandlungen mit detaillierten Informationen
- ✅ Aufklärungsvideos (YouTube-Integration)
- ✅ Nachsorge-Anweisungen mit Phasen-Timeline
- ✅ Öffnungszeiten und Kontaktinformationen
- ✅ Notfall-Informationen
- ✅ PWA (Installierbar auf allen Geräten)
- ✅ Offline-Funktionalität
- ✅ Echtzeit-Synchronisation

### Admin-Panel
- ✅ Sichere Authentifizierung mit Supabase Auth
- ✅ Praxis-Grunddaten verwalten
- ✅ Behandlungen erstellen, bearbeiten, löschen
- ✅ Videos verwalten
- ✅ Nachsorge-Anweisungen verwalten
- ✅ Öffnungszeiten anpassen
- ✅ Notfall-Informationen bearbeiten
- ✅ Live-Vorschau der Patienten-App

## Technologie-Stack

- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Backend:** Supabase (PostgreSQL, Real-time, Auth, Storage)
- **Build Tool:** Vite
- **PWA:** Service Worker, Web App Manifest
- **Design:** Cyan/Türkis Theme, Mobile-First

## Installation

### 1. Repository klonen

```bash
git clone <your-repo-url>
cd zahngut-app
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Supabase konfigurieren

Die Supabase-Verbindung ist bereits in `.env` konfiguriert:

```
VITE_SUPABASE_URL=https://eguojriprhquxmozbqxl.supabase.co
VITE_SUPABASE_ANON_KEY=<your-key>
```

Die Datenbank ist bereits eingerichtet mit:
- ✅ Alle Tabellen erstellt (praxis_info, treatments, videos, aftercare, etc.)
- ✅ Row Level Security aktiviert
- ✅ Beispieldaten geladen
- ✅ Indizes für Performance

### 4. Admin-Benutzer erstellen

1. Gehen Sie zu Ihrem Supabase Dashboard
2. Authentication → Users → Add User
3. Erstellen Sie einen Benutzer mit E-Mail und Passwort
4. Empfohlen: `admin@zahngut.de`

## Entwicklung

### Dev-Server starten

```bash
npm run dev
```

Die App läuft auf `http://localhost:5173`

### Admin-Panel aufrufen

```
http://localhost:5173/admin-login.html
```

Melden Sie sich mit dem erstellten Admin-Benutzer an.

## Deployment

### Build erstellen

```bash
npm run build
```

Die produktionsfertigen Dateien befinden sich im `dist/` Ordner.

### Deployment-Optionen

#### Option 1: Netlify (Empfohlen)
1. Verbinden Sie Ihr Git-Repository mit Netlify
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. Automatisches Deployment bei Git Push

#### Option 2: Vercel
1. Importieren Sie Ihr Projekt in Vercel
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Automatisches Deployment

#### Option 3: Supabase Hosting (falls verfügbar)
```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
npm run build
supabase deploy
```

## Datenbankstruktur

### Tabellen

1. **praxis_info** - Praxisinformationen
2. **opening_hours** - Wöchentliche Öffnungszeiten
3. **treatments** - Behandlungsangebote
4. **videos** - Aufklärungsvideos
5. **aftercare** - Nachsorge-Anweisungen
6. **design_settings** - UI-Anpassungen
7. **emergency_info** - Notfall-Kontakte

### Security

- ✅ Public READ access (Patienten)
- ✅ Authenticated WRITE access (Admin)
- ✅ Row Level Security aktiviert
- ✅ Automatische Timestamps

## PWA Installation

### iOS (Safari)
1. Öffnen Sie die App in Safari
2. Tippen Sie auf "Teilen" Icon
3. Wählen Sie "Zum Home-Bildschirm"
4. App wird wie native App installiert

### Android (Chrome)
1. Öffnen Sie die App in Chrome
2. Tippen Sie auf Menü (3 Punkte)
3. Wählen Sie "App installieren"
4. Bestätigen Sie die Installation

### Desktop (Chrome/Edge)
1. Öffnen Sie die App
2. Klicken Sie auf das ⊕ Icon in der Adressleiste
3. Klicken Sie auf "Installieren"

## Anpassungen

### Farben ändern

Bearbeiten Sie `/src/index.css`:

```css
:root {
  --primary: #0891b2;
  --accent: #06b6d4;
  /* weitere Farben... */
}
```

### Logo ändern

1. Gehen Sie zum Admin-Panel
2. Tab "Design-Einstellungen"
3. Ändern Sie das Emoji oder laden Sie ein Custom-Logo hoch

### PWA Icons generieren

Öffnen Sie `generate-icons.html` im Browser und laden Sie die generierten Icons herunter, oder verwenden Sie ein Tool wie:

- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

## Fehlerbehebung

### Build-Fehler
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Supabase-Verbindungsfehler
- Überprüfen Sie die `.env` Werte
- Stellen Sie sicher, dass die Supabase URL und Key korrekt sind
- Überprüfen Sie die RLS Policies im Supabase Dashboard

### Admin-Login funktioniert nicht
- Stellen Sie sicher, dass der Benutzer im Supabase Dashboard erstellt wurde
- Überprüfen Sie die Browser-Konsole auf Fehler
- Löschen Sie Browser-Cache und Cookies

## Browser-Support

- ✅ Chrome/Edge (empfohlen)
- ✅ Safari (iOS & macOS)
- ✅ Firefox
- ✅ Opera
- ✅ Samsung Internet

## Performance

- ⚡ Lighthouse Score: 90+
- ⚡ First Contentful Paint: <2s
- ⚡ Time to Interactive: <3s
- ⚡ Bundle Size: ~140KB (gzip: 38KB)

## Wartung

### Backup erstellen

Im Admin-Panel:
1. Tab "Export/Import" (wenn implementiert)
2. Klicken Sie auf "Backup erstellen"

Oder direkt in Supabase:
1. Dashboard → Database → Backups
2. Erstellen Sie manuelles Backup

### Daten aktualisieren

Alle Inhalte können über das Admin-Panel aktualisiert werden:
- Öffnungszeiten
- Behandlungen
- Videos
- Nachsorge-Anweisungen
- Kontaktdaten

Änderungen werden sofort in der Patienten-App sichtbar (Real-time).

## Support

Bei Fragen oder Problemen:
1. Überprüfen Sie die Browser-Konsole auf Fehler
2. Überprüfen Sie die Supabase Logs
3. Kontaktieren Sie den Entwickler

## Lizenz

Proprietär - Alle Rechte vorbehalten für Zahngut Bad Wünnenberg

---

**Entwickelt mit ❤️ für moderne Zahnmedizin**
