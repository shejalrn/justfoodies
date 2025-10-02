# Sanity Studio Deployment Guide

## Option 1: Deploy to Sanity's Hosting (Recommended)

### Steps:
1. **Install Sanity CLI globally:**
   ```bash
   npm install -g @sanity/cli
   ```

2. **Login to Sanity:**
   ```bash
   sanity login
   ```

3. **Deploy Studio:**
   ```bash
   cd sanity
   sanity deploy
   ```

4. **Choose studio hostname:** `justfoodie` (or any available name)

5. **Access Studio:** `https://justfoodie.sanity.studio`

## Option 2: Deploy to Vercel/Netlify

### Vercel:
1. Create new project on Vercel
2. Connect to your GitHub repo
3. Set build settings:
   - **Build Command:** `cd sanity && npm install && npm run build`
   - **Output Directory:** `sanity/dist`
   - **Root Directory:** `sanity`

### Netlify:
1. Create new site on Netlify
2. Connect to GitHub repo
3. Set build settings:
   - **Base Directory:** `sanity`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

## Environment Variables for Studio

Set these in your deployment platform:

```env
SANITY_STUDIO_PROJECT_ID=ybaq07b6
SANITY_STUDIO_DATASET=production
```

## Access URLs

After deployment, access your studio at:
- **Sanity Hosting:** `https://justfoodie.sanity.studio`
- **Custom Domain:** `https://your-studio-domain.com`

## Managing Content

### Add Menu Items:
1. Go to "Menu Items" in studio
2. Click "Create" 
3. Fill in details:
   - Title
   - Description  
   - Price
   - Category
   - Upload image
   - Set veg/non-veg
   - Mark as available

### Add Categories:
1. Go to "Categories"
2. Create new category
3. Set name, slug, position

### Upload Images:
1. Use the image field in menu items
2. Upload from computer
3. Images are automatically optimized

## Current Studio Access

**Project ID:** ybaq07b6  
**Dataset:** production  
**Studio URL:** Will be available after deployment