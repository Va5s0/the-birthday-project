# Birthday Project

_Never forget another birthday again!_

A self-hosted, open-source application for managing birthdays, name days, and staying connected with the people who matter most. Your data, your server, your privacy.

---

## Why Birthday Project?

You know that sinking feeling when you realize you forgot your friend's birthday... again?

Or worse - you forgot their kid's birthday AND their nameday?

**Birthday Project** is your personal celebration tracker that runs entirely on your computer. No cloud services, no data mining, just you and your important dates.

## Features

- **Contact Management**: Store contacts with birthdays and name days
- **Family Connections**: Track relationships and family members
- **Greek Name Days**: Built-in automatic nameday search for Greek names
- **Today Widget**: Dashboard showing today's celebrations
- **Multiple Views**: Card view and tree view for contacts
- **Avatar Support**: Upload profile pictures
- **Self-Hosted**: Complete privacy - all data stays on your computer
- **Docker Ready**: One-command setup
- **Modern UI**: Clean, responsive interface with theme support

## Screenshots

**Add Contacts:**
![Add Contact](./screenshots/AddContact.png)

**Add Connections:**
![Add Connection](./screenshots/AddConnection.png)

**Automatic Nameday Search:**
![Nameday Search](./screenshots/AutomaticNamedaySearch.png)

**Contact Cards:**
![Contact Cards](./screenshots/ContactConnectionsCards.png)

**Today's Celebrations:**
![Today Widget](./screenshots/TodayWidget.png)

---

## Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed
- Git (to clone the repository)

### Installation (3 Steps!)

**1. Clone the repository**

```bash
git clone https://github.com/Va5s0/the-birthday-project.git
cd the-birthday-project
```

**2. Run the setup script**

```bash
./setup.sh
```

This creates `.env` configuration files.

**3. Start the application**

```bash
docker-compose up -d
```

**That's it!** Open [http://localhost:3000](http://localhost:3000) and create your account.

---

## What Makes It Special

- **Complete Privacy**: Your data never leaves your computer
- **No Subscriptions**: Free forever, run it on your own hardware
- **Open Source**: Modify it however you want
- **Easy Backup**: Simple file-based SQLite database
- **Docker Magic**: No complex installation or dependencies
- **Greek Nameday Support**: Automatic nameday lookup for Greek Orthodox names
- **Family Trees**: Connect related contacts
- **Mobile-Friendly**: Works on your phone
- **No Awkward Moments**: Confirmation dialogs prevent accidental deletions

---

## Architecture

```
Frontend (React + Nginx)
         ↓
Backend API (Express + TypeScript)
         ↓
    ┌────┴────┬──────────┐
    ↓         ↓          ↓
SQLite    Files      Nodemailer
          /uploads   (Optional Email)
```

## Tech Stack

### Frontend
- React 18.2
- TypeScript 5.3
- Vite 6.3
- Material-UI 5.15
- TanStack Query (React Query)
- Emotion CSS

### Backend
- Node.js 20
- Express.js 4.x
- Prisma ORM
- SQLite 3.x
- JWT Authentication
- Nodemailer (password reset)

### DevOps
- Docker & Docker Compose
- Nginx

---

## Usage

### Managing Contacts

1. Click "Add Contact"
2. Fill in details (name, birthday, nameday, etc.)
3. Upload an avatar (optional)
4. Save

### Adding Connections

Connections are people related to your contacts (family members, friends):

1. Open a contact card
2. Click "Add Connection"
3. Enter connection details
4. Save

### View Modes

- **Card View**: Visual cards with contact info
- **Tree View**: Hierarchical view showing relationships

### Today Widget

Never miss a celebration! The dashboard shows birthdays and namedays happening today.

---

## Configuration

### Environment Variables

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:5001/api
```

**Backend** (`server/.env`):
```env
# IMPORTANT: Change these secrets!
JWT_ACCESS_SECRET=your-random-secret-here
JWT_REFRESH_SECRET=different-random-secret-here

# Optional: Email for password reset
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

Generate secure secrets:
```bash
openssl rand -base64 32
```

See `.env.example` files for complete options.

---

## Development

### Running Without Docker

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
yarn install
yarn start
```

### Building

**Backend:**
```bash
cd server
npm run build
```

**Frontend:**
```bash
yarn build
```

---

## Docker Management

```bash
# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Restart
docker-compose restart

# Rebuild after changes
docker-compose up --build

# Fresh start (deletes all data!)
docker-compose down -v
rm -rf server/data server/uploads
```

---

## Backup & Restore

### Backup

```bash
mkdir -p backups
cp -r server/data backups/data_$(date +%Y%m%d)
cp -r server/uploads backups/uploads_$(date +%Y%m%d)
```

### Restore

```bash
docker-compose down
cp -r backups/data_YYYYMMDD server/data
cp -r backups/uploads_YYYYMMDD server/uploads
docker-compose up -d
```

**Pro tip**: Set up a cron job for automatic daily backups!

---

## Troubleshooting

### Port Already in Use

Edit `docker-compose.yml` to use different ports:

```yaml
services:
  api:
    ports:
      - "5002:5001"  # Changed from 5001
  frontend:
    ports:
      - "3001:80"    # Changed from 3000
```

Update `VITE_API_URL` in `.env` accordingly.

### Database Locked

```bash
docker-compose down
docker-compose up
```

### Clear All Data

```bash
docker-compose down -v
rm -rf server/data server/uploads
docker-compose up
```

### Permission Issues

```bash
chmod -R 755 server/data server/uploads
```

---

## Security

### Development vs Production

**Important:** This Docker setup uses HTTP and is designed for **local development**.

For **production deployment**, you MUST:
- Deploy behind a **reverse proxy** (nginx, Caddy, Traefik) with HTTPS/SSL certificates
- Use **Let's Encrypt** for free SSL certificates or your own certificates
- Set cookies to `secure: true` and `sameSite: 'strict'` in production
- Update `FRONTEND_URL` to use `https://` instead of `http://`

### Security Checklist

- **Change default JWT secrets** in `server/.env` using `openssl rand -base64 32`
- Use **strong passwords** for user accounts
- Keep installation **updated** with latest releases
- Enable **HTTPS** via reverse proxy if exposing to internet
- **Regular backups** recommended (see Backup section)
- Consider **firewall rules** if self-hosting on a server
- Review and restrict **CORS origins** in production
- Keep `.env` files **private** (already in `.gitignore`)

---

## Migration from Firebase

Migrating from an older Firebase version? See [MIGRATION_PLAN.md](MIGRATION_PLAN.md) for the complete migration guide.

---

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code of conduct
- Development setup
- Pull request process
- Coding standards

---

## Roadmap

- [ ] End-to-end tests (Playwright)
- [ ] Email notifications for upcoming birthdays
- [ ] Import/export contacts (CSV, vCard)
- [ ] Calendar integration (iCal export)
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Recurring reminders
- [ ] Gift ideas tracker
- [ ] Birthday statistics

---

## Support

- **Documentation**: [DOCKER_SETUP.md](DOCKER_SETUP.md)
- **Issues**: [GitHub Issues](https://github.com/Va5s0/the-birthday-project/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Va5s0/the-birthday-project/discussions)

---

## License

This project is licensed under a **custom non-commercial license**:

- **Personal and internal business use only**
- **Commercial use prohibited** without prior written permission
- **Attribution required** in all copies or substantial portions
- The software is provided **"as is" without warranty**

See the [LICENSE](LICENSE) file for full details.

---

## Acknowledgements

- Built with love for keeping track of special moments
- Inspired by the need for privacy-first, self-hosted solutions
- Thanks to all contributors and users
- Special thanks to the open-source community

---

**Made with ❤️ for remembering the people who matter**
