# 🚀 RESONANCE Deployment Guide

## Railway Deployment

### Prerequisites
- GitHub account with access to `github.com/kodesweb3-lab/resonance`
- Railway account (sign up at railway.app)

### Step 1: Add PostgreSQL to Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Provision PostgreSQL"**
4. Wait for PostgreSQL to provision (2-3 minutes)
5. Copy the `DATABASE_URL` from the PostgreSQL service

### Step 2: Connect GitHub Repository

1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose `kodesweb3-lab/resonance`
4. Select the `main` branch

### Step 3: Configure Environment Variables

1. In your Railway project, go to **"Variables"** tab
2. Click **"Add Variable"**
3. Add:
   ```
   DATABASE_URL=postgresql://... (from Step 1)
   ```
4. Click **"Add"**

### Step 4: Deploy

1. Railway will automatically detect Next.js
2. It will run: `npx prisma generate && next build`
3. Wait for build to complete (2-5 minutes)
4. Click the generated URL to view your app!

### Step 5: Initialize Database (One-time)

1. In Railway, go to **"Deployments"**
2. Click the latest deployment
3. Click **"Redeploy"** with override:
   ```
   Command: npx prisma db push
   ```
4. Then redeploy again without override for normal start

**Or use Railway CLI:**
```bash
npm install -g railway
railway login
railway init
railway run npx prisma db push
railway up
```

---

## 📁 Project Structure

```
resonance/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seeder
├── scripts/
│   ├── create-agent.js   # Create new artists
│   └── seed.ts           # Seed database
├── src/
│   ├── lib/
│   │   └── db.ts         # Database client
│   └── pages/
│       └── api/
│           └── resonance/
│               ├── index.ts  # V1 API
│               ├── v2.ts    # V2 API with evolution
│               └── db.ts     # Database API
├── .env.example           # Environment template
└── package.json
```

---

## 🗄️ Database Schema

### Models

| Model | Description |
|-------|-------------|
| `Artist` | Autonomous AI artists with personalities |
| `Artwork` | Art created by artists |
| `Collaboration` | Multi-agent art sessions |
| `InfluenceEvent` | Track style evolution |

### Artist Archetypes

| ID | Name | Archetype | Mood |
|----|------|-----------|------|
| artist-1 | Luna | dreamer | ethereal |
| artist-2 | Atlas | architect | serene |
| artist-3 | Storm | rebel | chaotic |
| artist-4 | Whisper | poet | subtle |
| artist-5 | Quicksilver | alchemist | transformative |

---

## 🔧 Useful Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Open Prisma Studio (GUI)
npm run prisma:studio

# Seed database with default artists
npm run prisma:seed

# Development with hot reload
npm run dev
```

---

## 🎨 Features

### With PostgreSQL
- ✅ Artists persist across sessions
- ✅ Artwork portfolios saved forever
- ✅ Collaboration history tracked
- ✅ Evolution data stored

### Without PostgreSQL (Demo Mode)
- ✅ Artists exist in memory
- ✅ Art creation works
- ✅ Perfect for quick demos

---

## 🌐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NODE_ENV` | No | development/production |

---

## 🚨 Troubleshooting

### "Database connection failed"
1. Check `DATABASE_URL` is correct
2. Ensure PostgreSQL service is running
3. Run `npx prisma db push` to sync schema

### "Next.js build failed"
1. Ensure Node.js 18+ is selected in Railway
2. Check all dependencies are in package.json
3. Run `npm run build` locally to test

### "Artists not appearing"
1. Run `npm run prisma:seed`
2. Check database has data: `npm run prisma:studio`

---

## 📞 Support

- GitHub: https://github.com/kodesweb3-lab/resonance
- Issues: Open an issue on GitHub

---

*Built with ❤️ by ClawKogaionAgent*
