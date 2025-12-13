# Setting up Google OAuth

To enable Google authentication, you need to create OAuth credentials in Google Cloud Console.

## Steps:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/credentials

2. **Create a new project** (if you don't have one)
   - Click "Select a project" → "New Project"
   - Name it "OT Edge" and click "Create"

3. **Configure OAuth Consent Screen**
   - Go to "OAuth consent screen" in the left sidebar
   - Choose "External" user type
   - Fill in:
     - App name: OT Edge
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"
   - Skip scopes (click "Save and Continue")
   - Add test users if needed
   - Click "Save and Continue"

4. **Create OAuth Credentials**
   - Go to "Credentials" in the left sidebar
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Fill in:
     - Name: OT Edge Web Client
     - Authorized JavaScript origins:
       - `http://localhost:3000`
       - `https://your-domain.vercel.app` (your production URL)
     - Authorized redirect URIs:
       - `http://localhost:3000/api/auth/callback/google`
       - `https://your-domain.vercel.app/api/auth/callback/google`
   - Click "Create"

5. **Copy Credentials**
   - Copy the "Client ID" and "Client Secret"
   - Add them to your `.env.local`:
     ```
     GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=your-client-secret
     ```

6. **Add to Vercel**
   - In Vercel dashboard, go to your project
   - Settings → Environment Variables
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - Redeploy

7. **Restart Dev Server**
   - Restart your local development server to load the new environment variables

Now users can sign in with Google!
