# 🚀 StafferFi Startup Instructions

## Current Situation

✅ **PostgreSQL** - Running with all data loaded (316 agencies, 3,343 corrections)  
❌ **API Server** - Not running (needs to be started)  
❌ **Web Frontend** - Not running (needs to be started)

---

## Quick Start (2 Terminals Required)

### Terminal 1: Start API Server

```bash
./start-api.sh
```

**Expected output:**
```
✅ Connected to PostgreSQL
🚀 API listening on http://localhost:4000
📊 Endpoints:
   GET /health
   GET /api/stats
   ...
```

**Test it:**
```bash
# In another terminal
curl http://localhost:4000/health
```

---

### Terminal 2: Start Web Frontend

```bash
./start-web.sh
```

**Expected output:**
```
▲ Next.js 15.5.6
- Local:        http://localhost:3000
✓ Ready in 1449ms
```

**Access it:**
- Local: http://localhost:3000
- Gitpod: https://3000--019ad7e6-193a-7382-a07c-94261dfc9bd5.us-east-1-01.gitpod.dev

---

## Alternative: Manual Commands

### Start API (Terminal 1)
```bash
cd apps/api
DATABASE_URL=postgresql://stafferfi:stafferfi_dev@localhost:5432/ecfr_analytics node dist/index.js
```

### Start Web (Terminal 2)
```bash
cd apps/web
pnpm dev
```

---

## Verification Steps

### 1. Check PostgreSQL
```bash
docker-compose ps
# Should show postgres as "healthy"
```

### 2. Test API
```bash
# Health check
curl http://localhost:4000/health

# Get stats
curl http://localhost:4000/api/stats

# Get top agencies
curl http://localhost:4000/api/agencies/top/corrections?limit=3
```

### 3. Test Web
Open in browser:
- http://localhost:3000 (local)
- https://3000--019ad7e6-193a-7382-a07c-94261dfc9bd5.us-east-1-01.gitpod.dev (Gitpod)

You should see:
- Dashboard with 4 stat cards
- Top 5 agencies list
- Navigation menu

---

## Troubleshooting

### "Service Unavailable" on Port 4000

**Cause:** API server not running

**Fix:**
```bash
# Start API in Terminal 1
./start-api.sh
```

### "Service Unavailable" on Port 3000

**Cause:** Web server not running

**Fix:**
```bash
# Start Web in Terminal 2
./start-web.sh
```

### PostgreSQL Not Running

**Fix:**
```bash
docker-compose up -d postgres
# Wait 5 seconds
docker-compose ps  # Should show "healthy"
```

### No Data in PostgreSQL

**Fix:**
```bash
cd apps/lake
python3 etl_to_postgres.py
```

### Port Already in Use

**Fix:**
```bash
# Kill existing processes
pkill -f "node dist/index.js"  # API
pkill -f "next dev"            # Web

# Then restart
```

---

## What You Should See

### API (Port 4000)

**Root endpoint:**
```json
{
  "name": "eCFR Analytics API",
  "version": "1.0.0",
  "description": "API for analyzing Electronic Code of Federal Regulations data",
  "endpoints": { ... }
}
```

**Stats endpoint:**
```json
{
  "total_agencies": "316",
  "total_corrections": "3343",
  "first_year": 2005,
  "last_year": 2025
}
```

### Web (Port 3000)

**Dashboard showing:**
- Total Agencies: 316
- Total Corrections: 3,343
- First Year: 2005
- Years Tracked: 21
- Top 5 agencies with correction counts and RVI scores
- Navigation to Agencies, Corrections, Trends pages

---

## Why Background Processes Don't Work

The `exec` tool times out after 2 minutes when running background processes. This is why you need to:

1. **Use separate terminals** for API and Web
2. **Keep terminals open** while services run
3. **Use Ctrl+C** to stop services when done

---

## Service URLs

### Local Development
- API: http://localhost:4000
- Web: http://localhost:3000

### Gitpod Preview
- API: https://4000--019ad7e6-193a-7382-a07c-94261dfc9bd5.us-east-1-01.gitpod.dev
- Web: https://3000--019ad7e6-193a-7382-a07c-94261dfc9bd5.us-east-1-01.gitpod.dev

---

## Next Steps After Startup

Once both services are running:

1. ✅ Verify API responds: `curl http://localhost:4000/health`
2. ✅ Verify Web loads: Open http://localhost:3000 in browser
3. ✅ Check dashboard displays data correctly
4. 🚀 Continue with Phase 3 development (charts, agency pages, etc.)

---

## Quick Reference

```bash
# Check what's running
docker-compose ps                    # PostgreSQL
ps aux | grep "node dist/index.js"  # API
ps aux | grep "next dev"            # Web

# Start services
./start-api.sh    # Terminal 1
./start-web.sh    # Terminal 2

# Stop services
Ctrl+C in each terminal

# Or kill processes
pkill -f "node dist/index.js"
pkill -f "next dev"
docker-compose down
```

---

**Ready to start?** Open 2 terminals and run the startup scripts! 🚀
