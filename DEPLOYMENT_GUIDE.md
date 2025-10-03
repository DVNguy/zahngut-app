# Zahngut App - Deployment Guide

## Overview

This is a Progressive Web App (PWA) for Zahngut dental practice with:
- Customer-facing mobile app (installable)
- Admin panel for content management
- Real-time synchronization
- Offline functionality

## Current Status

✅ **The app is working with mock data** - You can test it immediately!

⚠️ **For production deployment**, you need to connect it to a real Supabase database.

## Quick Start (Development)

The app works immediately with mock data:

```bash
npm install
npm run dev
```

Open http://localhost:5173 and you'll see the app with sample data.

## Production Deployment to Vercel

### Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in:
   - Name: `zahngut-production`
   - Database Password: (create a strong password)
   - Region: Choose closest to your users
4. Wait 2-3 minutes for provisioning

### Step 2: Get Your Supabase Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy two values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long JWT token)

### Step 3: Set Up Database Tables

1. In Supabase, go to **SQL Editor**
2. Run each migration file in `supabase/migrations/` in order:
   - `20251003150153_create_initial_schema.sql`
   - `20251003185809_create_news_table.sql`
   - `20251003213407_add_public_read_policies.sql`

### Step 4: Deploy to Vercel

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zahngut-app.git
git push -u origin main
```

2. Go to https://vercel.com and sign in
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. **Configure Environment Variables**:
   - Click "Environment Variables"
   - Add:
     - `VITE_SUPABASE_URL` = Your Supabase Project URL
     - `VITE_SUPABASE_ANON_KEY` = Your anon public key
6. Click "Deploy"

### Step 5: Enable PWA Features

After deployment:

1. Visit your Vercel URL (e.g., `https://zahngut-app.vercel.app`)
2. On mobile devices, you'll see "Add to Home Screen" option
3. Install the app for offline functionality

## Admin Panel Setup

The admin panel is located at `/admin-login.html`

1. Access it at: `https://your-domain.vercel.app/admin-login.html`
2. Default password: `Zahngut2024!` (change this!)
3. Use the admin panel to:
   - Add/edit treatments
   - Post news updates
   - Manage videos and aftercare instructions
   - Customize design and colors

### Securing the Admin Panel

For production, you should:

1. Change the admin password in `public/admin-app.js`
2. Or implement proper authentication using Supabase Auth

## Features

### Customer App
- ✅ View treatments and services
- ✅ Watch educational videos
- ✅ Read aftercare instructions
- ✅ Book appointments (Doctolib integration)
- ✅ Emergency contact information
- ✅ Offline mode with cached content
- ✅ Installable as native-like app

### Admin Panel
- ✅ Manage all content in real-time
- ✅ Add/edit treatments with rich content
- ✅ Post news updates with images
- ✅ Upload and organize videos
- ✅ Customize colors and branding
- ✅ Update contact information

## Testing

```bash
# Run in development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### "Using mock data" warning in console

This is normal if you haven't configured Supabase yet. The app works with sample data.

**Solution**: Add valid Supabase credentials to your `.env` file or Vercel environment variables.

### Build fails

```bash
# Clean and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Admin panel not working

1. Check browser console for errors
2. Verify Supabase credentials are correct
3. Ensure RLS policies allow read/write access

### App not installing on mobile

1. Ensure you're accessing via HTTPS (Vercel provides this automatically)
2. Check that manifest.json is accessible
3. Verify service worker is registering (check DevTools → Application)

## Architecture

```
zahngut-app/
├── public/
│   ├── admin-login.html      # Admin authentication
│   ├── admin-panel.html      # Admin interface
│   ├── admin-app.js          # Admin logic
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service Worker
├── src/
│   ├── app.js                # Main app logic
│   ├── dataService.js        # Data fetching (Supabase + mock)
│   ├── supabaseClient.js     # Supabase client setup
│   ├── mockData.js           # Development data
│   ├── config.ts             # Environment configuration
│   └── index.css             # Styles
├── supabase/
│   └── migrations/           # Database schema
└── index.html                # Main entry point
```

## Environment Variables

### Development (.env file)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Production (Vercel)
Set the same variables in Vercel project settings.

## Support

For issues or questions:
- Check the console for detailed error messages
- Verify Supabase connection at: https://your-project.supabase.co
- Ensure all migrations have been run

## License

Proprietary - Zahngut Bad Wünnenberg
