# Waste Forecast Dashboard — Local Server

This project contains a static frontend (HTML/CSS/JS) and a tiny Express server that can serve a SQLite database (`*.db`) through a simple API and also serve the static site.

What I added:
- `server.js` — Express server with endpoints:
  - `GET /api/data` — smart endpoint that returns a structured JSON. It will try to read known tables from the detected `.db` file. If no DB tables found, it falls back to parsing `data.js`.
  - `GET /api/dbinfo` — lists detected tables in the SQLite DB.
  - `GET /api/query?table=<table>` — run `SELECT * FROM <table> LIMIT 20000` (useful for debugging large tables).
- `package.json` — Node dependencies and start script

How to run locally (Windows / PowerShell):

1. Install Node.js (if not already installed). Use Node 16+.
2. From the project folder (where `server.js` is), install dependencies:

```powershell
npm install
```

3. Start the server:

```powershell
npm start
```

4. Open the site in your browser: `http://localhost:3000/`.

Notes:
- The server will automatically detect the first `.db` file in the project folder (e.g. `waste_forecast (1).db`).
- If your environment cannot access the SQLite file, the server will fall back to reading `data.js` and return that content via `/api/data`.

Deploying to Render (recommended easy free option)

This guide shows a simple Render deployment using Docker. Render is a straightforward choice for running a Node.js service that reads a local SQLite file included in the repository.

Preparation
- Put your SQLite DB file (for example `waste_forecast (1).db`) in the project root. The server auto-detects the first `.db` file.
- Commit and push the repository to GitHub.

Step-by-step (Render)
1. Create a free account at https://render.com and verify your email.
2. Click "New" → "Web Service".
3. Connect your GitHub account and select the repository containing this project.
4. In the service settings:
  - Environment: `Docker`
  - Branch: `main` (or whichever branch you pushed)
  - Dockerfile path: `/Dockerfile` (we added one to this repo)
  - Port: `3000` (default)
  - Plan: `Free` (if available)
5. Create the service and wait for the build/deploy to finish. Render will build the Docker image and run it. The service dashboard will display a public HTTPS URL when ready.

Notes about the DB file
- Because the DB file lives in the repository, it is included in the Docker image and served alongside your app. This is fine for read-only analytics apps and small DBs.
- If you need to update the DB, push a new commit with the updated `.db` then trigger a redeploy.

Alternative providers
- Railway, Fly.io, and Replit also support Node services and can run this Dockerfile — choose whichever you prefer.

Creating a QR code for your public URL
Once the service is deployed, Render provides a public HTTPS URL (for example `https://weise-waste-dashboard.onrender.com`). Use this to create a QR code:

- Quick web generator: visit https://www.qr-code-generator.com/ and paste the public URL.
- Command-line using the free QR server API (saves a PNG locally):

```bash
curl -o qrcode.png "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://YOUR_PUBLIC_URL"
```

Replace `https://YOUR_PUBLIC_URL` with the Render URL (URL-encode if necessary). The file `qrcode.png` will be created in the current folder; print or share it.

Temporary local sharing (ngrok)
- If you only want a quickly shareable temporary URL while developing locally, install `ngrok` and run:

```powershell
ngrok http 3000
```

Use the generated public URL to create the QR code exactly as above.


Security:
- This server is minimal and designed for local use. Do not expose it on the public internet without adding authentication and limiting file access.

If you'd like, I can:
- Convert `/api/data` to compute exactly the same `WASTE_DATA` shape from the SQLite tables (now it attempts to read likely tables and falls back to `data.js`).
- Add a deployable config for Railway/Render and instructions to create a QR code automatically.
