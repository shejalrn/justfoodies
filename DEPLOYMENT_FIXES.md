# Deployment Fixes Applied

## Issues Fixed

### 1. Login/Signup API Issue
**Problem**: Frontend hardcoded to `localhost:3000` causing API calls to fail in production

**Fix**: Updated `frontend/src/utils/api.js` to use relative URLs in production:
```javascript
baseURL: import.meta.env.PROD ? '' : 'http://localhost:3000'
```

### 2. Error Response Format
**Problem**: Inconsistent error messages from backend validation

**Fix**: Improved error response format in `src/routes/users.js` for better frontend handling

### 3. Sanity CMS Connection
**Problem**: Sanity not working in production

**Potential Issues**:
- Environment variables not set correctly
- Sanity dataset empty
- Token permissions

**Debug Steps**:
1. Test Sanity connection: `GET /api/sanity/test`
2. Check environment variables in Coolify
3. Verify Sanity dataset has data

## Next Steps

### 1. Deploy Updated Code
```bash
git add .
git commit -m "Fix: API base URL and error handling for production"
git push origin main
```

### 2. Redeploy in Coolify
- Go to your Coolify dashboard
- Redeploy the application
- Check logs for any errors

### 3. Run Database Setup (if needed)
```bash
npm run db:push
npm run db:seed
```

### 4. Test Sanity Connection
Visit: `https://your-domain.com/api/sanity/test`

### 5. Verify Environment Variables
Ensure these are set in Coolify:
- `SANITY_PROJECT_ID=ybaq07b6`
- `SANITY_DATASET=production`
- `SANITY_TOKEN=your-token`

## Sanity Troubleshooting

If Sanity still doesn't work:

1. **Check Sanity Studio**: Visit `https://justfoodie.sanity.studio`
2. **Verify Data**: Ensure categories and menu items exist
3. **Check Token**: Verify token has read permissions
4. **Test API**: Use the `/api/sanity/test` endpoint