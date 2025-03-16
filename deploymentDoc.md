To deploy your Next.js frontend (e.g., the `page.tsx` code you provided) to Vercel, you’ll need to follow a straightforward process. Vercel is optimized for Next.js applications, making deployment simple. Below is a step-by-step guide to prepare and deploy your project to Vercel, assuming your backend (NestJS) is hosted separately (e.g., on another service like Render, Heroku, or a VPS). If your backend is also part of the same repository

---

## Steps to Deploy Your Next.js App to Vercel

### 1. Prepare Your Project
Ensure your Next.js project is ready for deployment:

#### a. Verify Project Structure
Your project should have a standard Next.js structure. Based on your `page.tsx`, it looks like it’s in `app/booking/page.tsx` (App Router). A typical structure might look like:
```
flight_booking_frontend/
├── app/
│        # Root layout (if applicable)
├── public/                 # Static assets (optional)
├── package.json
├── next.config.js          # Optional Next.js config
└── .gitignore
```

#### b. Set Environment Variables
check for .env.sample file and update your env
```
# .env.local (for local development)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```
For Vercel, you’ll add this as an environment variable later via the dashboard.

#### c. Install Dependencies
Ensure all dependencies are listed in `package.json`. Run:
```bash
npm install
```
Common dependencies for your project might include:
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0"
  }
}
```

#### d. Test Locally
Run your app locally to ensure it works:
```bash
npm run dev
```
Visit `http://localhost:3000/booking` and test the booking flow with your local backend (`http://localhost:3001`).

#### e. Add Vercel Config (Optional)
Vercel auto-detects Next.js projects, but you can add a `vercel.json` file for custom settings (e.g., if you need specific routes or rewrites). For your case, it’s likely not needed unless you have custom requirements. A basic example:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "app/**/*.{js,ts,jsx,tsx}",
      "use": "@vercel/next"
    }
  ]
}
```

---

### 2. Push to GitHub
Vercel deploys from a Git repository (GitHub, GitLab, or Bitbucket). If you haven’t already:

#### a. Initialize Git
```bash
git init
git add .
git commit -m "Initial commit"
```

#### b. Create a GitHub Repository
- Go to GitHub and create a new repository (e.g., `flight_booking_frontend`).
- Push your code:
  ```bash
  git remote add origin https://github.com/your-username/flight_booking_frontend.git
  git branch -M main
  git push -u origin main
  ```

#### c. Ignore Sensitive Files
Add `.env.local` to `.gitignore`:
```
.env.local
node_modules/
```

---

### 3. Deploy to Vercel
#### a. Sign Up/Login to Vercel
- Go to [vercel.com](https://vercel.com) and sign up or log in with your GitHub account.

#### b. Import Your Repository
- From the Vercel dashboard, click **"New Project"**.
- Select **"Import Git Repository"** and choose your `flight_booking_frontend` repository.
- Grant Vercel access to your GitHub account if prompted.

#### c. Configure Project Settings
- **Framework Preset**: Vercel should auto-detect "Next.js".
- **Root Directory**: Leave as default (`./`) unless your Next.js app is in a subdirectory.
- **Build & Output Settings**: Vercel uses defaults (`npm run build` and `next start`), so no changes needed.
- **Environment Variables**:
  - Add `NEXT_PUBLIC_API_BASE_URL`:
    - **Key**: `NEXT_PUBLIC_API_BASE_URL`
    - **Value**: The URL of your deployed backend (e.g., `https://your-backend.onrender.com` or `http://localhost:3001` for testing if tunneled).
  - Click **"Add"** and save.

#### d. Deploy
- Click **"Deploy"**. Vercel will:
  - Install dependencies (`npm install`).
  - Build your app (`npm run build`).
  - Deploy it to a URL (e.g., `https://flight-booking-frontend.vercel.app`).

#### e. Check Deployment Logs
- Watch the deployment logs in the Vercel dashboard. If successful, you’ll see a URL to visit your app.

---

### 4. Test Your Deployed App
- Visit the deployed URL (e.g., `https://flight-booking-frontend.vercel.app/booking?departureFlight=123&returnFlight=456`).
- Ensure the booking flow works with your backend:
  - Enter passenger details and click "Book Now".
  - Check the Network tab for SSE events from `/booking/events`.
  - Verify the redirect to `/bookings`.

---

### 5. Configure Backend Integration
Since your frontend uses SSE and API calls to a backend (`NEXT_PUBLIC_API_BASE_URL`), ensure your backend is:
- Deployed and accessible (e.g., on Render, Heroku, or a VPS).
- CORS-enabled to allow requests from your Vercel domain:
  ```typescript
  // src/main.ts (NestJS)
  app.enableCors({
    origin: 'https://flight-booking-frontend.vercel.app', // Replace with your Vercel URL
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type, Authorization',
  });
  ```
- Replace `http://localhost:3001` in `NEXT_PUBLIC_API_BASE_URL` with the live backend URL in Vercel’s environment variables.

#### Example: Update Environment Variable
If your backend is at `https://flight-booking-backend.onrender.com`:
- Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**.
- Update `NEXT_PUBLIC_API_BASE_URL` to `https://flight-booking-backend.onrender.com`.
- Redeploy (push a commit or click "Redeploy" in Vercel).

---

### 6. Automate Future Deployments
- Vercel auto-deploys on every push to the `main` branch.
- To update your app:
  ```bash
  git add .
  git commit -m "Update booking logic"
  git push origin main
  ```
- Vercel will rebuild and deploy automatically.

---

### Troubleshooting
#### a. Deployment Fails
- Check Vercel logs for errors (e.g., missing dependencies, build issues).
- Ensure `package.json` has a `"build": "next build"` script.

#### b. SSE Not Working
- Verify `NEXT_PUBLIC_API_BASE_URL` matches your backend URL.
- Check browser console for CORS errors or failed SSE connections.
- Use Vercel’s **Functions Logs** (Dashboard → Functions) if you add serverless functions later.

#### c. Redirect Issues
- Ensure `/bookings` exists in your app (add a `app/bookings/page.tsx` if missing).

---

### Sample README for Deployment
Add this to your project’s `README.md` for reference:
```markdown
# Flight Booking Frontend

## Deployment to Vercel

1. **Push to GitHub**:
   - `git add .`
   - `git commit -m "Initial commit"`
   - `git push origin main`

2. **Deploy on Vercel**:
   - Login to [vercel.com](https://vercel.com).
   - Import `flight_booking_frontend` repository.
   - Set `NEXT_PUBLIC_API_BASE_URL` to your backend URL (e.g., `https://flight-booking-backend.onrender.com`).
   - Deploy and visit the generated URL.

3. **Environment Variables**:
   - `NEXT_PUBLIC_API_BASE_URL`: Backend API URL.

4. **Local Development**:
   - `npm install`
   - `npm run dev`
   - Visit `http://localhost:3000/booking`

## Backend
- Deploy separately (e.g., Render, Heroku).
- Update CORS to allow Vercel domain.
```

---


