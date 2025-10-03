# Quick Start Guide - Zahngut Bad Wünnenberg PWA

## 🚀 In 5 Minuten einsatzbereit!

### Schritt 1: Admin-Benutzer erstellen
1. Öffne [Supabase Dashboard](https://supabase.com/dashboard)
2. Gehe zu deinem Projekt
3. **Authentication** → **Users** → **Add User**
4. Erstelle Benutzer:
   - Email: `admin@zahngut.de`
   - Password: [Sicheres Passwort]
   - ✅ Confirm email

### Schritt 2: Lokale Entwicklung starten
```bash
npm install
npm run dev
```

Die App läuft jetzt auf **http://localhost:5173**

### Schritt 3: Admin-Panel testen
1. Öffne http://localhost:5173/admin-login.html
2. Melde dich mit dem erstellten Account an
3. Passe Praxis-Daten an:
   - Tab "Grunddaten": Kontaktinformationen
   - Tab "Behandlungen": Behandlungsangebote
   - Tab "Öffnungszeiten": Wochenplan

### Schritt 4: Patienten-App testen
1. Öffne http://localhost:5173
2. Navigiere durch alle Bereiche:
   - 🏠 Home
   - 🎥 Videos
   - 🦷 Behandlungen
   - 📅 Termine
   - 🚨 Notfall

### Schritt 5: Produktiv deployen

**Option A: Netlify (1-Klick)**
```bash
npm run build
```
Dann `dist/` Ordner auf Netlify hochladen

**Option B: Mit Git**
1. Push zu GitHub/GitLab
2. Verbinde Repository mit Netlify/Vercel
3. Automatisches Deployment

## ✅ Fertig!

Die App ist jetzt:
- ✅ Live im Internet
- ✅ Als PWA installierbar
- ✅ Offline-fähig
- ✅ Real-time synchronisiert

## 📱 Nächste Schritte

### Inhalte anpassen
- Admin-Panel: Alle Texte und Daten editieren
- Änderungen erscheinen sofort in der App
- Keine Code-Änderungen nötig!

### PWA testen
- Auf Smartphone öffnen
- "Zum Home-Bildschirm hinzufügen"
- App wie native App nutzen

### Eigene Domain verbinden
- Bei Netlify/Vercel: Settings → Domains
- DNS-Records anpassen
- SSL wird automatisch aktiviert

## 🆘 Hilfe benötigt?

**Dokumentation:**
- `README.md` - Vollständige Dokumentation
- `DEPLOYMENT.md` - Deployment-Anleitung

**Häufige Probleme:**
- Admin-Login geht nicht? → Admin-User in Supabase erstellt?
- Build-Fehler? → `rm -rf node_modules && npm install`
- Daten laden nicht? → .env Datei korrekt?

**Supabase Dashboard:**
https://supabase.com/dashboard

---

**Viel Erfolg mit Ihrer Zahnarztpraxis-App! 🦷**
