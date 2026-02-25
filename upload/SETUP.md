# 🚀 ShareFullStackApp - Setup Guide

## 📦 What You Downloaded

You've received `sharefullstackapp.tar.gz` containing:
- **118 source files** (TypeScript/TSX components, APIs, configs)
- **Complete application code** - ready to run
- **Database schema** - Prisma configuration
- **WebSocket service** - Real-time telemetry
- **UI components** - shadcn/ui library
- **Documentation** - Architecture and quick reference

---

## 🔧 QUICK START (5 Minutes)

### Prerequisites
```bash
# Install Bun (JavaScript runtime)
# macOS/Linux:
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell):
powershell -c "irm bun.sh/install.ps1 | iex"

# Verify installation
bun --version
```

### Step 1: Extract Files
```bash
# If you have the tar.gz file:
tar -xzf sharefullstackapp.tar.gz

# This creates the project structure
```

### Step 2: Install Dependencies
```bash
cd sharefullstackapp

# Install main app dependencies
bun install

# Install WebSocket service dependencies
cd mini-services/telemetry-service
bun install
cd ../..
```

### Step 3: Setup Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env if needed (default values work for dev)
# DATABASE_URL="file:./db/custom.db" is already set
```

### Step 4: Initialize Database
```bash
# Create database and push schema
bun run db:push

# This creates db/custom.db with all tables
```

### Step 5: Start the Application

**Terminal 1 - Main App:**
```bash
bun run dev
```
Output:
```
▲ Next.js 16.1.3 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.x.x:3000
```

**Terminal 2 - WebSocket Service:**
```bash
cd mini-services/telemetry-service
bun run dev
```
Output:
```
WebSocket service running on port 3004
```

### Step 6: Access the App
```
Open: http://localhost:3000

Login Credentials:
- Admin:    username: admin    password: admin123
- Operator: username: operator password: operator123
```

---

## 📁 PROJECT STRUCTURE

```
sharefullstackapp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Main dashboard
│   │   ├── layout.tsx          # Root layout
│   │   └── api/                # API routes
│   │       ├── users/          # User management
│   │       ├── telemetry/      # Telemetry data
│   │       ├── payments/       # Payment records
│   │       └── settings/       # Configuration
│   ├── components/
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── TelemetryTable.tsx
│   │   │   ├── PaymentHistory.tsx
│   │   │   ├── UserList.tsx
│   │   │   └── SettingsPanel.tsx
│   │   ├── security/           # Security components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── PacketMonitoring.tsx
│   │   │   ├── AnomalyDetection.tsx
│   │   │   ├── SecurityEventsFeed.tsx
│   │   │   └── NetworkSummary.tsx
│   │   └── ui/                 # shadcn/ui components (50+)
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication state
│   └── lib/
│       ├── db.ts               # Prisma client
│       └── utils.ts            # Utility functions
├── prisma/
│   └── schema.prisma           # Database schema
├── mini-services/
│   └── telemetry-service/
│       ├── index.ts            # WebSocket server
│       └── package.json
├── db/
│   └── custom.db               # SQLite database (generated)
├── public/                     # Static assets
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind CSS config
├── next.config.ts              # Next.js config
├── .env.example                # Environment template
├── ARCHITECTURE.md             # Detailed architecture
└── SETUP.md                    # This file
```

---

## 🎯 FEATURES INCLUDED

### ✅ Authentication
- Login system with demo users
- Role-based access control (admin/operator)
- Session management
- Logout functionality

### ✅ Dashboard Tabs
- **Telemetry** - Live graphs, real-time data, simulation controls
- **Payments** - Payment history and management
- **Users** - User management and roles
- **Settings** - System configuration

### ✅ Security Features
- Real-time packet monitoring
- Anomaly detection with severity levels
- Security event logging
- Network metrics summary (6 cards)

### ✅ Real-Time Updates
- WebSocket connection for live data
- Sub-second telemetry updates
- Automatic refresh for monitoring components
- Live graphs using Recharts

### ✅ UI/UX
- Futuristic glass-morphism design
- Light/Dark mode toggle
- Responsive design (mobile-friendly)
- Smooth animations
- Custom scrollbars

---

## 🔌 API ENDPOINTS

All endpoints are at `http://localhost:3000/api/`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users` | GET | List all users |
| `/users` | POST | Create new user |
| `/telemetry` | GET | Get telemetry readings |
| `/telemetry` | POST | Submit telemetry data |
| `/payments` | GET | List payments |
| `/payments` | POST | Create payment |
| `/settings` | GET | Get configuration |
| `/settings` | PUT | Update configuration |

---

## 🐛 TROUBLESHOOTING

### Issue: "Port 3000 already in use"
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "Module not found"
```bash
rm -rf node_modules
bun install
```

### Issue: "Database not found"
```bash
bun run db:push
```

### Issue: "WebSocket not connecting"
```bash
# Make sure telemetry service is running
cd mini-services/telemetry-service
bun run dev
```

### Issue: Blank page or errors
```bash
# Check browser console for errors
# Check terminal for server errors
# Try clearing .next cache:
rm -rf .next
bun run dev
```

---

## 🚀 RUNNING IN PRODUCTION

### Build the App
```bash
bun run build
```

### Start Production Server
```bash
# Main app
bun start

# WebSocket service (in another terminal)
cd mini-services/telemetry-service
bun run dev
```

### Deploy Options

**Option 1: Vercel (Recommended)**
```bash
bun add -g vercel
vercel
```

**Option 2: Docker**
```dockerfile
# Create Dockerfile in project root
FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build
EXPOSE 3000
CMD ["bun", "start"]
```

```bash
docker build -t sharefullstackapp .
docker run -p 3000:3000 -p 3004:3004 sharefullstackapp
```

**Option 3: VPS/Cloud Server**
```bash
# Upload files
scp -r sharefullstackapp user@server:/path/to/app

# SSH and run
ssh user@server
cd /path/to/app
bun install
bun run build
bun start
```

---

## 🔒 BEFORE GOING TO PRODUCTION

### Required Changes:
1. **Replace demo authentication** with real JWT/NextAuth
2. **Set strong environment variables**
3. **Use HTTPS** (Vercel handles automatically)
4. **Migrate to PostgreSQL** (SQLite is for dev)
5. **Add rate limiting** to APIs
6. **Configure CORS** properly
7. **Set up monitoring** (Sentry, APM)
8. **Enable database backups**

### Environment Variables for Production:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"
```

---

## 📚 ADDITIONAL RESOURCES

- **Architecture**: See `ARCHITECTURE.md` for detailed technical docs
- **Quick Reference**: See `QUICK_REFERENCE.md` for fast lookup
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com

---

## 💡 TIPS

1. **Keep two terminals open** - One for main app, one for WebSocket
2. **Use `bun run lint`** - Check code quality
3. **Check browser console** - For client-side errors
4. **Use "Start Simulation"** - To see real-time data flow
5. **Try all tabs** - Explore all features
6. **Switch themes** - Test light/dark mode
7. **Resize browser** - Test responsive design

---

## ✅ CHECKLIST

After extraction, you should have:
- [ ] `src/` folder with all components
- [ ] `prisma/schema.prisma` file
- [ ] `mini-services/telemetry-service/` folder
- [ ] `package.json` file
- [ ] `package.json` shows Next.js 16, React 19, TypeScript 5

After setup:
- [ ] Dependencies installed (`node_modules/` exists)
- [ ] Database created (`db/custom.db` exists)
- [ ] App runs on http://localhost:3000
- [ ] Can login with admin/admin123
- [ ] Can see dashboard with all tabs
- [ ] Telemetry simulation works

---

## 🎉 YOU'RE READY!

Once everything is set up:
1. Open http://localhost:3000
2. Login with credentials above
3. Click "Start Simulation" to see real-time data
4. Explore all 4 tabs: Telemetry, Payments, Users, Settings
5. Try the dark/light mode toggle
6. Watch the live graphs update in real-time!

**Enjoy your ShareFullStackApp! 🚀**

---

## 🆘 Need Help?

If you encounter issues:
1. Check this file's Troubleshooting section
2. Check browser console (F12) for errors
3. Check terminal for server errors
4. Review ARCHITECTURE.md for technical details
5. Make sure both servers are running (port 3000 and 3004)

---

**Version:** 1.0.0
**Last Updated:** 2024-02-25
**Tech Stack:** Next.js 16, TypeScript 5, Prisma, Socket.IO, Tailwind CSS 4, shadcn/ui
