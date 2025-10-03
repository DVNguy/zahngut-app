# Quick Deploy to GitHub & Vercel

## ✅ Already Done

Your project is ready with:
- ✅ Git initialized
- ✅ Initial commit made
- ✅ All files tracked
- ✅ Build tested and working

## Step 1: Push to GitHub (5 minutes)

### Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   ```
   Repository name: zahngut-app
   Description: Zahngut Bad Wünnenberg PWA - Dental Practice App
   Private or Public: Your choice (Private recommended)
   ```
3. **DO NOT** initialize with README, .gitignore, or license
4. Click "Create repository"

### Push Your Code

GitHub will show you instructions. Use these commands in your terminal:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/zahngut-app.git

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

**Example:**
```bash
git remote add origin https://github.com/johndoe/zahngut-app.git
git push -u origin main
```

You'll be asked for credentials - use a [Personal Access Token](https://github.com/settings/tokens) if prompted.

---

## Step 2: Deploy to Vercel (5 minutes)

### Option A: Automatic Deploy (Recommended)

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Click "Import Git Repository"
4. Find your `zahngut-app` repository
5. Click "Import"

### Configure Build Settings

Vercel will auto-detect Vite. Settings should be:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Leave these as default** - Vercel detects them automatically!

### Add Environment Variables

**IMPORTANT:** Before clicking Deploy, add these:

1. Click "Environment Variables"
2. Add TWO variables:

   **Variable 1:**
   ```
   Name: VITE_SUPABASE_URL
   Value: [Your Supabase URL or leave blank for now]
   ```

   **Variable 2:**
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: [Your Supabase anon key or leave blank for now]
   ```

   **Note:** If you leave them blank, the app will work with mock data. Add real values later when you set up Supabase.

3. Click "Deploy"

### Wait for Deployment

- Vercel will build and deploy (takes ~2 minutes)
- You'll see a progress log
- When done, you'll get a URL like: `https://zahngut-app.vercel.app`

---

## Step 3: Test Your Deployment

1. Click the deployment URL
2. You should see the Zahngut app!
3. It will show: "⚠️ Using mock data" (this is normal)
4. Test on your phone - add to home screen

---

## Step 4: Connect to Real Database (Optional)

If you want real data (not mock data):

1. Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to create database
2. Get your Supabase URL and anon key
3. In Vercel:
   - Go to your project
   - Settings → Environment Variables
   - Edit `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Add your real values
   - Redeploy (automatic)

---

## Quick Reference

### Your Project Structure

```
Local:     /tmp/cc-agent/57975241/project/
GitHub:    https://github.com/YOUR_USERNAME/zahngut-app
Vercel:    https://zahngut-app.vercel.app (after deploy)
```

### Important URLs After Deployment

- **Customer App:** `https://zahngut-app.vercel.app/`
- **Admin Login:** `https://zahngut-app.vercel.app/admin-login.html`
- **Admin Panel:** `https://zahngut-app.vercel.app/admin-panel.html`

### Updating After Changes

```bash
# Make your changes
git add .
git commit -m "Your change description"
git push

# Vercel automatically redeploys!
```

---

## Troubleshooting

### "Repository already exists" on GitHub

- Use a different name: `zahngut-pwa`, `zahngut-dental`, etc.
- Or delete the existing repo and recreate

### Git push asks for password

- GitHub no longer accepts passwords
- Create a [Personal Access Token](https://github.com/settings/tokens)
- Use the token as your password

### Vercel build fails

- Check the build log in Vercel dashboard
- Common issue: Missing environment variables (add them)
- Try: Settings → General → Redeploy

### App shows errors in production

- Open browser console (F12)
- Check if Supabase credentials are set
- Verify the app works with mock data first

---

## What Happens with Mock Data?

The app works immediately with sample data:
- ✅ All features visible and functional
- ✅ Perfect for testing and demos
- ✅ No database setup required
- ⚠️ Admin changes don't persist
- ⚠️ Data resets on page reload

**For production use:** Set up Supabase following [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

---

## Next Steps After Deployment

1. ✅ Test the app on your phone
2. ✅ Try installing it (Add to Home Screen)
3. ✅ Test the admin panel
4. 📝 Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for real database
5. 🎨 Customize content in admin panel
6. 📱 Share the URL with patients!

---

## Need Help?

### GitHub Issues
- Check: https://docs.github.com/en/get-started
- Personal Access Token: https://github.com/settings/tokens

### Vercel Issues
- Check: https://vercel.com/docs
- Support: https://vercel.com/support

### Supabase Setup
- See: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

---

## Summary

Your app is ready to deploy! Just:

1. **GitHub:** Create repo → Push code (5 min)
2. **Vercel:** Import repo → Deploy (5 min)
3. **Done!** Share your URL

The app works immediately with mock data. Connect Supabase later for production use.

**Ready? Start with Step 1 above! 🚀**
