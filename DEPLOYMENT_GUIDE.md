# 🚀 Deployment Guide - DAO Platform

Complete guide to deploy your DAO platform to production!

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- ✅ Smart contracts are deployed to Sepolia (DONE!)
- ✅ `frontend/src/config.js` has correct contract address
- ✅ All tests pass: `npm test` (in both root and frontend)
- ✅ Frontend builds successfully: `cd frontend && npm run build`
- ✅ Code is pushed to GitHub
- ✅ No `.env` file in git (already in `.gitignore`)

---

## 🎯 Recommended: Deploy with Vercel

### Why Vercel?
- ✅ Free tier (perfect for this project)
- ✅ Built for Vite/React apps
- ✅ Auto-deploys from GitHub
- ✅ Custom domains with free HTTPS
- ✅ Fast global CDN
- ✅ Zero configuration needed

---

## 🌐 Method 1: Deploy via Vercel Website (Easiest)

### Step 1: Create Vercel Account

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your repositories

### Step 2: Import Your Project

1. Click **"Add New Project"**
2. Find and select: `solidity-erc20-project-clean`
3. Click **"Import"**

### Step 3: Configure Build Settings

**Important:** Configure these settings:

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 18.x or 20.x
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes ⏱️
3. 🎉 Your site is live!
4. You'll get a URL like: `your-dao-project.vercel.app`

### Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Connect MetaMask (make sure you're on Sepolia network)
3. Create a test organization
4. Verify everything works!

---

## 💻 Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login

```bash
vercel login
```

Choose your login method (GitHub recommended).

### Step 3: Deploy from Frontend Directory

```bash
cd frontend
vercel
```

**Follow the prompts:**
- Set up and deploy? `Y`
- Which scope? (Your account)
- Link to existing project? `N`
- What's your project's name? `dao-platform` (or your choice)
- In which directory is your code located? `./`
- Want to override settings? `N`

### Step 4: Deploy to Production

```bash
vercel --prod
```

This creates a production deployment with your custom domain.

---

## 🔧 Vercel Configuration Files

### `vercel.json` (Already Created)

This file ensures React Router works correctly in production:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This redirects all routes to `index.html` so your React app can handle routing.

---

## 🌍 Custom Domain Setup (Optional)

### Add a Custom Domain

1. Go to your project on Vercel
2. Click **"Settings"** → **"Domains"**
3. Add your domain (e.g., `mydao.com`)
4. Follow DNS configuration instructions
5. Vercel automatically provisions SSL certificate

### Free Domain Options

If you don't have a domain:
- **Vercel subdomain**: `your-project.vercel.app` (free, included)
- **Freenom**: Free domains (`.tk`, `.ml`, `.ga`)
- **Namecheap/GoDaddy**: Paid domains ($10-15/year)

---

## 🔄 Automatic Deployments

### Set Up Auto-Deploy from GitHub

Vercel automatically deploys when you push to GitHub:

1. **Push to `main` branch** → Auto-deploys to production
2. **Push to any branch** → Creates preview deployment
3. **Open Pull Request** → Creates preview deployment with unique URL

### How It Works

```bash
# Make changes
git add .
git commit -m "Update proposal creation"
git push origin main

# Vercel automatically:
# 1. Detects the push
# 2. Runs npm install
# 3. Runs npm run build
# 4. Deploys to production
# 5. Sends you a notification
```

---

## 📊 Environment Variables (If Needed)

If you need to add environment variables:

### On Vercel Dashboard

1. Go to **Project Settings** → **Environment Variables**
2. Add your variables:
   - `VITE_FACTORY_ADDRESS` (if you want to make it configurable)
   - `VITE_CHAIN_ID`
   - etc.

### In Your Code

```javascript
// Access in your code
const factoryAddress = import.meta.env.VITE_FACTORY_ADDRESS
```

**Note:** Currently your config is hardcoded, which is fine for this project!

---

## 🔍 Troubleshooting

### Build Fails on Vercel

**Error**: `Module not found`
- **Fix**: Make sure all dependencies are in `package.json`
- Run: `cd frontend && npm install`

**Error**: `Build command failed`
- **Fix**: Test build locally first: `npm run build`
- Check for TypeScript/linting errors

### Blank Page After Deploy

**Issue**: Page loads but shows nothing
- **Fix**: Check browser console for errors
- **Fix**: Verify `vercel.json` is in `frontend` folder
- **Fix**: Ensure `dist` is the output directory

### MetaMask Not Connecting

**Issue**: Can't connect wallet
- **Fix**: Make sure you're on Sepolia network in MetaMask
- **Fix**: Check contract address in `config.js`
- **Fix**: Clear browser cache and try again

### "Network Error" When Creating Organization

**Issue**: Transactions fail
- **Fix**: Verify you have Sepolia ETH
- **Fix**: Check contract address is correct
- **Fix**: Verify contract is deployed: https://sepolia.etherscan.io/address/YOUR_ADDRESS

---

## 🎨 Alternative Deployment Options

### Option 2: Netlify

Very similar to Vercel:

1. Go to **https://netlify.com**
2. **"Add new site"** → **"Import from Git"**
3. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Deploy!

### Option 3: GitHub Pages

Free but requires more setup:

```bash
cd frontend
npm install gh-pages --save-dev
```

Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/solidity-erc20-project-clean",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

Then deploy:
```bash
npm run deploy
```

### Option 4: IPFS (Fully Decentralized)

For a truly decentralized deployment:

1. Use **Fleek.co** (easiest IPFS deployment)
2. Connect GitHub repository
3. Configure build settings
4. Deploy to IPFS + get IPFS hash + ENS domain

**More complex but truly Web3!**

---

## 📈 Post-Deployment

### What to Monitor

1. **Vercel Dashboard**: View deployment logs, analytics
2. **Etherscan**: Monitor contract interactions
3. **Error Tracking**: Consider adding Sentry (optional)
4. **Analytics**: Consider adding Google Analytics (optional)

### Share Your DAO!

Once deployed, share:
- ✅ Your Vercel URL: `https://your-dao.vercel.app`
- ✅ Contract address: `0x8AAe77bb135D008577a5567D2311c0335C855A93`
- ✅ Network: Sepolia Testnet
- ✅ Guide users to get Sepolia ETH from faucets

---

## 🔒 Security Checklist

Before going public:

- ✅ `.env` is in `.gitignore` (DONE!)
- ✅ No private keys in code (DONE!)
- ✅ Contract is verified on Etherscan (optional but recommended)
- ✅ Test all features work in production
- ✅ Have a bug report process

---

## 📝 Quick Command Reference

```bash
# Local testing
cd frontend
npm run dev          # Test locally

# Build for production
npm run build        # Creates dist folder
npm run preview      # Preview production build locally

# Deploy to Vercel (CLI)
vercel               # Deploy preview
vercel --prod        # Deploy to production

# Push to GitHub (auto-deploys via Vercel)
git add .
git commit -m "Deploy to production"
git push origin main
```

---

## 🎉 Success!

Once deployed, your DAO platform will be:
- ✅ Live on the internet
- ✅ Accessible to anyone with the URL
- ✅ Connected to Sepolia testnet
- ✅ Ready for users to create DAOs!

### Next Steps After Deployment

1. **Test thoroughly** - Create orgs, proposals, vote
2. **Share with friends** - Get feedback
3. **Monitor usage** - Check Vercel analytics
4. **Iterate** - Fix bugs, add features
5. **Eventually deploy to mainnet** - When ready for production!

---

## 💡 Pro Tips

### Performance
- Vercel automatically optimizes your build
- Images are compressed
- Code is minified
- Assets are cached on CDN

### Custom Features
- Add **OG tags** for better social sharing
- Add **favicon** (currently shows default Vite icon)
- Add **Google Analytics** for usage tracking

### Cost
- **Vercel Free Tier includes:**
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic HTTPS
  - Preview deployments
  - Custom domains

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Community**: Vercel Discord server

---

**You're ready to deploy! Follow Method 1 (Vercel Website) for the easiest experience.** 🚀

**Deployment URL**: Once deployed, you'll get a URL like:
- **Preview**: `solidity-erc20-project-clean-git-main-yourname.vercel.app`
- **Production**: `solidity-erc20-project-clean.vercel.app`
- **Custom**: `your-custom-domain.com`

**Happy deploying!** 🎉
