# Supabase Setup Guide

## Why You Need This

Currently, the app uses **mock data** for development. To make it work with a real database where:
- The admin panel can save changes
- Changes appear on all customer devices in real-time
- Data persists between sessions

You need to connect it to Supabase.

## Step-by-Step Setup

### 1. Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub, Google, or email

### 2. Create a New Project

1. Click "New Project"
2. Fill in the details:
   ```
   Name: zahngut-production
   Database Password: [Create a strong password - save it!]
   Region: Frankfurt (or closest to Germany)
   ```
3. Click "Create new project"
4. ⏰ **Wait 2-3 minutes** while Supabase sets up your database

### 3. Get Your Credentials

Once the project is ready:

1. Go to **Settings** (gear icon) → **API**
2. You'll see two important values:

   **Project URL:**
   ```
   https://abcdefghijklmnop.supabase.co
   ```

   **anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....(very long string)
   ```

3. **Copy both values** - you'll need them next!

### 4. Set Up the Database

1. In your Supabase project, click on **SQL Editor** in the left sidebar
2. Click "New Query"
3. Open the file `supabase/migrations/20251003150153_create_initial_schema.sql` from this project
4. Copy ALL the content and paste it into the SQL Editor
5. Click **RUN** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

7. Repeat for the other migration files:
   - `supabase/migrations/20251003185809_create_news_table.sql`
   - `supabase/migrations/20251003213407_add_public_read_policies.sql`

8. Verify tables were created:
   - Click **Table Editor** in the left sidebar
   - You should see tables: `praxis_info`, `opening_hours`, `treatments`, `videos`, etc.

### 5. Configure Your App

#### For Local Development:

1. Create a file called `.env` in the project root (if it doesn't exist)
2. Add your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....
   ```
3. Replace with YOUR actual values from Step 3
4. Restart your dev server:
   ```bash
   npm run dev
   ```

#### For Production (Vercel):

1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Add two variables:
   - Name: `VITE_SUPABASE_URL`, Value: `https://your-project-id.supabase.co`
   - Name: `VITE_SUPABASE_ANON_KEY`, Value: `eyJhbGciOiJIUzI1NiIsInR5...`
4. Click **Save**
5. Redeploy your app (Vercel will redeploy automatically)

### 6. Add Initial Data

You can add data two ways:

#### Option A: Use the Admin Panel
1. Go to `/admin-login.html`
2. Login (default password: `Zahngut2024!`)
3. Add treatments, news, videos, etc. through the UI

#### Option B: Insert Directly in Supabase
1. Go to **Table Editor** in Supabase
2. Click on a table (e.g., `praxis_info`)
3. Click "Insert row"
4. Fill in the data
5. Click "Save"

### 7. Verify It's Working

After setup, you should see in the browser console:
- ❌ BEFORE: `⚠️ Using mock data - Supabase not configured`
- ✅ AFTER: No warning (or connection success message)

Test by:
1. Opening the app
2. Adding a news item in the admin panel
3. Refreshing the customer app - the news should appear!

## Troubleshooting

### "Error fetching data" in console

**Cause:** Invalid credentials or database not set up

**Solution:**
1. Double-check your URL and key in `.env`
2. Make sure you ran ALL migration files
3. Verify the project is running (not paused) in Supabase

### Admin panel can't save

**Cause:** Row Level Security policies not set up

**Solution:**
- Make sure you ran the migration file: `20251003213407_add_public_read_policies.sql`
- This sets up the security policies that allow reading/writing data

### "Mock data" warning still showing

**Cause:** Environment variables not loaded

**Solution:**
1. Make sure `.env` file is in the project ROOT (not in src/)
2. Restart your dev server after creating `.env`
3. Check the file is named exactly `.env` (not `.env.txt`)

### Can't connect to Supabase URL

**Cause:** Typo in URL or project paused

**Solution:**
1. Verify the URL in Supabase dashboard matches your `.env`
2. Check if your project is paused (free tier pauses after inactivity)
3. Wake it up by visiting the Supabase dashboard

## Security Notes

### Is the anon key safe to expose?

**Yes!** The anon key is meant to be public. It's safe because:
- Row Level Security (RLS) policies control what data can be accessed
- The anon key only allows operations that RLS permits
- Your database password is never exposed

### Changing the Admin Password

The default password (`Zahngut2024!`) is hardcoded for testing.

**To change it:**
1. Open `public/admin-app.js`
2. Find the line: `const ADMIN_PASSWORD = 'Zahngut2024!';`
3. Change it to your secure password
4. Redeploy

**Better approach:** Implement Supabase Auth (more secure)

## Next Steps

Once Supabase is connected:

1. ✅ Add your real practice information in the admin panel
2. ✅ Upload treatments with photos
3. ✅ Add educational videos
4. ✅ Customize colors and branding
5. ✅ Test the PWA on mobile devices
6. ✅ Deploy to Vercel for production use

## Need Help?

- Supabase Docs: https://supabase.com/docs
- This project's issues: [Create an issue on GitHub]
- Supabase Community: https://github.com/orgs/supabase/discussions
