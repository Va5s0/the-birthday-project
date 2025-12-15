# Docker Setup Guide

## Prerequisites

- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Run the setup script

```bash
./setup.sh
```

This will:
- Check if Docker is installed
- Create `.env` files from examples
- Show you next steps

### 2. Start the application

```bash
docker-compose up
```

Or run in background:

```bash
docker-compose up -d
```

### 3. Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

### 4. Create your account

Open http://localhost:3000 and sign up!

## Managing the Application

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f frontend
```

### Stop the application

```bash
docker-compose down
```

### Restart after code changes

```bash
docker-compose down
docker-compose up --build
```

### Remove all data (fresh start)

```bash
docker-compose down -v
rm -rf server/data server/uploads
docker-compose up
```

## Data Persistence

Your data is stored in:
- **Database**: `server/data/database.db`
- **Uploads**: `server/uploads/`

These directories are mounted as volumes, so your data persists even when containers are stopped.

## Backup & Restore

### Backup

```bash
# Create backup directory
mkdir -p backups

# Backup database and uploads
cp -r server/data backups/data_$(date +%Y%m%d)
cp -r server/uploads backups/uploads_$(date +%Y%m%d)
```

### Restore

```bash
# Stop the application first
docker-compose down

# Restore from backup
cp -r backups/data_YYYYMMDD server/data
cp -r backups/uploads_YYYYMMDD server/uploads

# Start again
docker-compose up
```

## Troubleshooting

### Port already in use

If ports 3000 or 5001 are already in use, edit `docker-compose.yml`:

```yaml
ports:
  - "3001:80"  # Change 3000 to 3001
```

### Database locked error

Stop all containers and restart:

```bash
docker-compose down
docker-compose up
```

### Build errors

Clean rebuild:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Permission issues

Make sure the data and uploads directories are writable:

```bash
chmod -R 755 server/data server/uploads
```

## Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5001/api
```

### Backend (server/.env)

Key variables:
- `JWT_ACCESS_SECRET` - Change this for security!
- `JWT_REFRESH_SECRET` - Change this for security!
- `SMTP_*` - Configure for password reset emails (optional)

Generate secure secrets:
```bash
openssl rand -base64 32
```

## Production Deployment

For production deployment:

1. Update environment variables in `server/.env`:
   - Set `NODE_ENV=production`
   - Change JWT secrets
   - Configure SMTP for emails

2. Update `VITE_API_URL` in `.env` to your production API URL

3. Consider using:
   - HTTPS reverse proxy (nginx, Caddy)
   - Automatic backups
   - Monitoring and logging

## Architecture

```
┌─────────────────┐
│  Nginx:80       │  Frontend (React + Vite)
│  → localhost:3000
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Express:5001   │  Backend API
└────────┬────────┘
         │
    ┌────┴────┬──────────┐
    ▼         ▼          ▼
┌────────┐ ┌──────┐ ┌────────┐
│SQLite  │ │Files │ │Nodemailer
│.db     │ │/uploads │SMTP   │
└────────┘ └──────┘ └────────┘
```

## Support

For issues and questions, check the main README.md or open an issue on GitHub.
