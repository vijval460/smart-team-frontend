# Teamforge Frontend - Smart Team Formation UI

The modern, responsive web application for **Teamforge**, built with **React**, **TypeScript**, and **Vite**. It enables project leads and teams to input project requirements, view real-time skill matching coverage, and assemble optimal project teams.

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 6
- **Styling**: Modern Vanilla CSS with responsive design system and CSS Variables
- **Icons**: Lucide React
- **API Integration**: Native Fetch with credentials (`credentials: 'include'`) for secure session cookies

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- Running Teamforge backend server (default `http://localhost:8081`)

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default (Local) |
|---|---|---|
| `VITE_API_URL` | Base URL pointing to the Spring Boot REST API | `http://localhost:8081/api` |

*Note: In development, Vite is pre-configured with a local proxy (`/api` -> `http://localhost:8081`), ensuring zero CORS friction.*

### 4. Running the Development Server
```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Building for Production
```bash
npm run build
```

This will run TypeScript type checking (`tsc -b`) and bundle optimized production assets into the `dist/` directory.

To test the production build locally:
```bash
npm run preview
```

---

## ☁️ Deployment Guide

### Deploying on Vercel
1. Import your frontend repository on [Vercel](https://vercel.com).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Under **Environment Variables**, set:
   - `VITE_API_URL`: Your deployed backend API base URL (e.g. `https://your-teamforge-backend.onrender.com/api`)
6. Deploy!

### Deploying on Netlify
1. Import your repository on [Netlify](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable `VITE_API_URL` in **Site Settings > Environment Variables**.
5. Ensure single-page app redirects are active (a `_redirects` file with `/* /index.html 200`).
