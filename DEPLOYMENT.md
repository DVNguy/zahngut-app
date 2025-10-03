# Deployment Checklist - Zahngut Bad Wünnenberg

## Vor dem Deployment

### 1. Supabase Setup
- [x] Datenbank-Schema erstellt
- [x] Beispieldaten eingefügt
- [x] Row Level Security aktiviert
- [ ] Admin-Benutzer erstellt
  - Gehe zu: Supabase Dashboard → Authentication → Users
  - Klicke: "Add User"
  - E-Mail: `admin@zahngut.de`
  - Passwort: [Ihr sicheres Passwort]
  - Confirm User: Ja

### 2. Umgebungsvariablen
- [x] `.env` Datei mit Supabase Credentials
- [x] VITE_SUPABASE_URL konfiguriert
- [x] VITE_SUPABASE_ANON_KEY konfiguriert

### 3. Build testen
```bash
npm run build
```
- [x] Build läuft ohne Fehler
- [x] Dist-Ordner wird erstellt
- [x] Alle Assets werden generiert

## Deployment-Optionen

### Option A: Netlify (Empfohlen)

#### Erstmaliges Setup
1. Gehe zu [netlify.com](https://netlify.com)
2. Klicke "Add new site" → "Import an existing project"
3. Verbinde dein Git-Repository
4. Konfiguration:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Environment Variables:**
     - `VITE_SUPABASE_URL`: `https://eguojriprhquxmozbqxl.supabase.co`
     - `VITE_SUPABASE_ANON_KEY`: [Ihr Key]

5. Klicke "Deploy site"

#### Automatische Deployments
- Jeder Git Push löst automatisch ein neues Deployment aus
- Branch Previews für Pull Requests verfügbar

### Option B: Vercel

#### Erstmaliges Setup
1. Gehe zu [vercel.com](https://vercel.com)
2. Klicke "Add New" → "Project"
3. Importiere dein Git-Repository
4. Framework Preset: Vite
5. Konfiguration:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

6. Environment Variables:
   - `VITE_SUPABASE_URL`: `https://eguojriprhquxmozbqxl.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: [Ihr Key]

7. Klicke "Deploy"

### Option C: Eigener Server (VPS/Hosting)

#### Anforderungen
- Node.js 18+ installiert
- Nginx oder Apache als Reverse Proxy
- SSL-Zertifikat (Let's Encrypt empfohlen)

#### Schritte
1. Build lokal erstellen:
```bash
npm run build
```

2. `dist/` Ordner auf Server hochladen:
```bash
scp -r dist/* user@server:/var/www/zahngut/
```

3. Nginx Konfiguration:
```nginx
server {
    listen 80;
    server_name zahngut.de www.zahngut.de;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name zahngut.de www.zahngut.de;

    ssl_certificate /etc/letsencrypt/live/zahngut.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zahngut.de/privkey.pem;

    root /var/www/zahngut;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /admin-login.html {
        try_files $uri =404;
    }

    location /admin-panel.html {
        try_files $uri =404;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

4. Nginx neu laden:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Nach dem Deployment

### 1. Admin-Account testen
1. Öffne `https://your-domain.com/admin-login.html`
2. Melde dich mit dem erstellten Admin-Benutzer an
3. Verifiziere, dass alle Tabs funktionieren

### 2. Patienten-App testen
1. Öffne `https://your-domain.com`
2. Teste alle Sektionen:
   - [ ] Home-Seite lädt
   - [ ] Behandlungen anzeigen
   - [ ] Videos abspielen
   - [ ] Nachsorge-Anweisungen öffnen
   - [ ] Termine-Sektion
   - [ ] Notfall-Informationen

### 3. PWA Installation testen
- [ ] iOS (Safari): "Zum Home-Bildschirm"
- [ ] Android (Chrome): Install-Prompt
- [ ] Desktop (Chrome): Install-Icon in Adressleiste

### 4. Echtzeit-Sync testen
1. Öffne Admin-Panel
2. Ändere eine Behandlung
3. Öffne Patienten-App in anderem Browser/Tab
4. Verifiziere, dass Änderung sofort sichtbar ist

### 5. Offline-Funktionalität testen
1. Öffne Patienten-App
2. Lade ein paar Seiten
3. Schalte Internet aus (Flugmodus)
4. Navigiere durch die App
5. Verifiziere, dass gecachte Inhalte sichtbar sind

## Performance-Check

Nach Deployment mit Lighthouse testen:
```
https://pagespeed.web.dev/
```

Erwartete Werte:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: ✓

## Domain-Setup

### DNS-Konfiguration
Wenn Sie eine eigene Domain verwenden:

1. **A Record** (für Root Domain):
   - Type: A
   - Name: @
   - Value: [Server IP oder Netlify/Vercel IP]

2. **CNAME Record** (für www):
   - Type: CNAME
   - Name: www
   - Value: [apex domain oder hosting provider]

3. **SSL-Zertifikat**:
   - Netlify/Vercel: Automatisch
   - Eigener Server: Let's Encrypt via Certbot

## Monitoring & Wartung

### Empfohlene Tools
1. **Uptime Monitoring**: UptimeRobot, Pingdom
2. **Error Tracking**: Sentry (optional)
3. **Analytics**: Google Analytics, Plausible (optional)

### Regelmäßige Aufgaben
- [ ] Wöchentlich: Backup der Supabase-Datenbank
- [ ] Monatlich: Dependency Updates (`npm update`)
- [ ] Vierteljährlich: Security Audit

## Troubleshooting

### Problem: Admin-Login funktioniert nicht
**Lösung:**
- Überprüfen Sie, ob der Admin-User in Supabase erstellt wurde
- Browser-Konsole auf Fehler prüfen
- Supabase Auth Logs prüfen

### Problem: Bilder/Assets laden nicht
**Lösung:**
- Überprüfen Sie die Build-Ausgabe
- Stellen Sie sicher, dass alle Assets im `dist/` Ordner sind
- Überprüfen Sie Server-Konfiguration (CORS, Cache-Headers)

### Problem: PWA installiert sich nicht
**Lösung:**
- HTTPS muss aktiviert sein
- `manifest.json` muss korrekt serviert werden
- Service Worker muss registriert sein
- Browser-Kompatibilität prüfen

### Problem: Echtzeit-Updates funktionieren nicht
**Lösung:**
- Supabase Realtime ist aktiviert (Project Settings → API)
- RLS Policies erlauben READ-Zugriff
- WebSocket-Verbindung ist nicht blockiert

## Notfall-Wiederherstellung

### Datenbank wiederherstellen
1. Gehe zu Supabase Dashboard
2. Database → Backups
3. Wähle Backup-Zeitpunkt
4. Klicke "Restore"

### Vorherige Version deployen
**Netlify/Vercel:**
1. Gehe zu Deployments
2. Wähle funktionierende Version
3. Klicke "Publish deploy"

**Eigener Server:**
1. Git checkout zur funktionierenden Version
2. Neu bauen und deployen

## Kontakte

**Entwickler:** [Ihr Name]
**Hosting:** [Hosting-Provider]
**Domain:** [Domain-Registrar]
**Support:** [Support-Kontakt]

---

**Stand:** Oktober 2025
**Version:** 1.0.0
