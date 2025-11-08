# Deployment Guide for CodeX Hosting

## The Issue: "Failed to create server" Error

When you deploy the frontend to Vercel (or any other hosting platform), you'll see a "Failed to create server. Please try again." error because the frontend cannot communicate with the backend.

### Why This Happens

- **In Development (Replit)**: The Vite dev server uses a proxy to forward API requests from the frontend to the backend (port 3001). Both run on the same machine, so this works fine.

- **In Production (Vercel)**: The frontend is deployed to Vercel, but the backend is NOT. When the frontend tries to make API calls, it can't find the backend because they're on different servers.

## Solution: Set Up Backend URL

You have two main options:

### Option 1: Deploy Backend to Replit (Recommended)

1. **Keep your backend running on Replit**:
   - The backend is already set up in the `server/` folder
   - It runs on port 3001
   - Replit will give you a public URL for your app

2. **Get your Replit backend URL**:
   - In Replit, run: `echo $REPLIT_DEV_DOMAIN`
   - Or check the Webview URL when the backend is running
   - It should look like: `xxxxxxx-xxx-xxx.replit.dev`

3. **Configure Vercel to use this backend**:
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add a new variable:
     - **Name**: `VITE_API_BASE_URL`
     - **Value**: `https://your-replit-domain.replit.dev` (replace with your actual Replit URL)
   - Redeploy your Vercel project

### Option 2: Deploy Both Frontend and Backend Together

Instead of using Vercel, deploy everything to Replit:

1. **Remove the separate frontend deployment** (Vercel)
2. **Use only Replit for hosting**:
   - The frontend will be served on port 5000
   - The backend will run on port 3001
   - The proxy will handle routing between them

3. **Access your app**:
   - Use the Replit-provided URL
   - Everything will work out of the box without additional configuration

## Environment Variables Reference

### Frontend (.env)

Create a `.env` file in the root directory (next to `package.json`):

```env
# Backend API URL (required for production deployments)
# Leave empty for development (proxy will handle it)
VITE_API_BASE_URL=https://your-backend-url.com

# Socket.IO Backend URL (optional, defaults to current origin)
VITE_SOCKET_BASE_URL=https://your-backend-url.com
```

### For Vercel Deployment

1. Go to: Project Settings → Environment Variables
2. Add these variables:
   - `VITE_API_BASE_URL` = Your backend URL (e.g., `https://your-app.replit.dev`)
   - `VITE_SOCKET_BASE_URL` = Your backend URL (same as above)
3. Redeploy your project

### For Replit Deployment (No Configuration Needed!)

If you're hosting everything on Replit, you don't need to set these variables. The proxy configuration in `vite.config.ts` handles everything automatically.

## Testing Your Setup

### Development (Replit)
1. Make sure both workflows are running:
   - `backend`: Runs the backend server
   - `dev`: Runs the frontend Vite server
2. Open the Replit Webview - everything should work

### Production (Vercel + Replit Backend)
1. Make sure your Replit backend is running (use the `backend` workflow)
2. Set `VITE_API_BASE_URL` in Vercel to your Replit URL
3. Redeploy Vercel
4. Your Vercel site should now be able to create servers

## Troubleshooting

### Still getting "Failed to create server"?

1. **Check backend is running**: 
   - Make sure your backend server is accessible
   - Test it by visiting: `https://your-backend-url/api/servers`
   - You should see a JSON response

2. **Check CORS**:
   - The backend already has CORS enabled (`app.use(cors())`)
   - This allows requests from any domain

3. **Check environment variables**:
   - In Vercel, verify `VITE_API_BASE_URL` is set correctly
   - The URL should include `https://` and have no trailing slash

4. **Check browser console**:
   - Open browser Developer Tools (F12)
   - Look for errors in the Console tab
   - Network tab will show if API requests are being made to the correct URL

## Need Help?

- Check that your backend URL is publicly accessible
- Verify the environment variables are set correctly
- Make sure to redeploy after changing environment variables
