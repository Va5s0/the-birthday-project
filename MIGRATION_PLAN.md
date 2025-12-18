# Firebase to Self-Hosted Migration Plan

## Overview

Migrate from Firebase (Auth, Firestore, Storage) to a **fully self-hosted, open-source** stack that anyone can run on their own computer.

## Project Vision

- **Open Source**: Free for anyone to use, modify, and distribute
- **Self-Hosted**: Runs entirely on user's own hardware (no cloud dependency)
- **Easy Setup**: Simple `docker-compose up` to get started
- **Privacy-First**: All data stays on user's computer
- **Future**: If positive feedback, consider commercial hosted version

## Target Architecture

```
┌─────────────────┐
│  Vite + React   │ (Port 3000)
│   TypeScript    │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│   Express.js    │ (Port 5001)
│   TypeScript    │
│   JWT Auth      │
└────────┬────────┘
         │
         ├──────────┬────────────────┐
         ▼          ▼                ▼
    ┌────────┐  ┌──────┐      ┌──────────┐
    │SQLite  │  │Files │      │ Nodemailer│
    │.db file│  │/uploads     │   SMTP    │
    └────────┘  └──────┘      └──────────┘
```

**Why SQLite?**

- ✅ Zero configuration (no separate database server)
- ✅ Single file database (easy backups)
- ✅ Perfect for single-user installations
- ✅ Handles Greek + English text search perfectly
- ✅ Lighter Docker setup (2 containers instead of 3)
- ✅ Production-ready and reliable

## Database Schema (Prisma + SQLite)

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./data/database.db"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id              String    @id @default(uuid())
  email           String    @unique
  passwordHash    String
  firstName       String?
  lastName        String?
  phoneNumber     String?
  birthday        String?   // ISO date string
  avatarUrl       String?   // /uploads/users/{id}/avatar.jpg
  namedayId       String?
  namedayDate     String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  contacts        Contact[]
  passwordResets  PasswordReset[]
}

model Contact {
  id          String   @id @default(uuid())
  userId      String
  firstName   String
  lastName    String?
  email       String?
  phone       String?
  mobile      String?
  birthday    String?  // ISO date string
  avatarUrl   String?  // /uploads/users/{userId}/contacts/{id}/avatar.jpg
  namedayId   String?
  namedayDate String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  connections Connection[]
}

model Connection {
  id          String  @id @default(uuid())
  contactId   String
  firstName   String?
  lastName    String?
  phone       String?
  mobile      String?
  email       String?
  birthday    String?
  avatarUrl   String?
  namedayId   String?
  namedayDate String?
  contact     Contact @relation(fields: [contactId], references: [id], onDelete: Cascade)
}

model PasswordReset {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## API Endpoints

### Authentication

```
POST   /api/auth/register          - Create account
POST   /api/auth/login             - Login (returns JWT tokens)
POST   /api/auth/logout            - Logout (invalidate refresh token)
POST   /api/auth/refresh           - Refresh access token
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Confirm password reset
DELETE /api/auth/account           - Delete user account
```

### User Profile

```
GET    /api/user/profile           - Get current user profile
PUT    /api/user/profile           - Update user profile
POST   /api/user/avatar            - Upload user avatar
DELETE /api/user/avatar            - Delete user avatar
```

### Contacts

```
GET    /api/contacts               - Get all user contacts
POST   /api/contacts               - Create new contact
GET    /api/contacts/:id           - Get single contact
PUT    /api/contacts/:id           - Update contact
DELETE /api/contacts/:id           - Delete contact
POST   /api/contacts/:id/avatar    - Upload contact avatar
DELETE /api/contacts/:id/avatar    - Delete contact avatar
```

### Connections (nested under contacts)

```
GET    /api/contacts/:id/connections       - Get contact's connections
POST   /api/contacts/:id/connections       - Add connection to contact
PUT    /api/contacts/:id/connections/:cid  - Update connection
DELETE /api/contacts/:id/connections/:cid  - Delete connection
```

### Static Files

```
GET    /uploads/users/:userId/avatar.jpg               - User avatar
GET    /uploads/users/:userId/contacts/:id/avatar.jpg  - Contact avatar
```

## JWT Authentication Strategy

### Token Types

1. **Access Token** (short-lived: 15 minutes)

   - Stored in memory on frontend
   - Contains: userId, email
   - Sent in Authorization header: `Bearer <token>`

2. **Refresh Token** (long-lived: 7 days)
   - Stored in httpOnly cookie (secure, sameSite)
   - Used to get new access tokens
   - Stored in database for revocation capability

### Auth Flow

```
1. Login → Server returns access token + httpOnly refresh cookie
2. Frontend stores access token in memory (useState)
3. API requests include: Authorization: Bearer <accessToken>
4. When access token expires (15min):
   - Frontend calls /api/auth/refresh
   - Server validates refresh cookie
   - Returns new access token
5. Logout → Server invalidates refresh token in DB
```

## File Storage Structure

```
/uploads
  /users
    /{userId}
      /avatar.jpg          (user profile picture)
      /contacts
        /{contactId}
          /avatar.jpg      (contact avatar)
```

### File Upload Handling

- Library: `multer` (Express middleware)
- Max size: 5MB
- Allowed types: image/jpeg, image/png, image/jpg
- Validation: file type, size, malicious content
- Response: relative path saved to database

## Email Configuration (Nodemailer)

### SMTP Options (choose one):

1. **Gmail** (development)

   - Free, easy setup
   - Requires app-specific password
   - 500 emails/day limit

2. **SendGrid** (production)

   - Free tier: 100 emails/day
   - Better deliverability
   - API key authentication

3. **Mailgun** (production alternative)
   - Free tier: 5,000 emails/month
   - Good for transactional emails

### Email Templates Needed

1. Password reset email
2. Welcome email (optional)
3. Account deletion confirmation (optional)

## Migration Steps

### Phase 1: Backend Setup (Days 1-2)

- [ ] Create `/server` directory
- [ ] Initialize Node.js project with TypeScript
- [ ] Install dependencies:
  - express, prisma, @prisma/client
  - bcrypt, jsonwebtoken, cookie-parser
  - multer, nodemailer
  - cors, dotenv, helmet
- [ ] Set up Prisma with SQLite
- [ ] Create database schema (User, Contact, Connection, PasswordReset models)
- [ ] Generate Prisma client
- [ ] Run initial migration to create database.db file

### Phase 2: Authentication (Days 3-4)

- [ ] Implement JWT utilities (sign, verify, refresh)
- [ ] Build auth routes:
  - Register (hash password with bcrypt)
  - Login (compare password, return tokens)
  - Refresh token endpoint
  - Logout (invalidate refresh token)
- [ ] Create auth middleware for protected routes
- [ ] Test auth flow with Postman/Insomnia

### Phase 3: Password Reset (Day 5)

- [ ] Configure Nodemailer with SMTP
- [ ] Create password reset token generation
- [ ] Build forgot-password endpoint
- [ ] Build reset-password endpoint
- [ ] Create email template
- [ ] Test complete flow

### Phase 4: User Profile (Day 6)

- [ ] Build user CRUD endpoints
- [ ] Implement avatar upload with multer
- [ ] Create file serving middleware
- [ ] Test profile updates and avatar upload

### Phase 5: Contacts & Connections (Days 7-8)

- [ ] Build contacts CRUD endpoints
- [ ] Build connections nested endpoints
- [ ] Implement contact avatar upload
- [ ] Add cascade delete logic
- [ ] Test all contact operations

### Phase 6: Frontend Migration (Days 9-11)

- [ ] Create API client service (replace Firebase calls)
- [ ] Update AuthContext:
  - Replace Firebase auth with API calls
  - Implement token management
  - Add token refresh logic
- [ ] Update Contacts component:
  - Replace Firestore onSnapshot with polling or remove real-time
  - Use fetch/axios for CRUD operations
- [ ] Update avatar upload components:
  - Replace Firebase Storage with file upload API
  - Update image URLs to point to Express server
- [ ] Update password reset flow
- [ ] Remove Firebase dependencies from package.json

### Phase 7: Docker Setup (Days 12-13)

- [ ] Create Dockerfile for React app (multi-stage build with Nginx)
- [ ] Create Dockerfile for Express API
- [ ] Create docker-compose.yml with:
  - Express API container with volume mounts:
    - ./data:/app/data (SQLite database)
    - ./uploads:/app/uploads (user files)
  - Nginx container for React app
  - Shared network between containers
  - Environment variables configuration
- [ ] Create .dockerignore files (node_modules, .git, .env)
- [ ] Create setup script for easy installation
- [ ] Test complete stack with `docker-compose up`
- [ ] Verify SQLite data persists after container restart
- [ ] Verify uploads persist after container restart

### Phase 8: Documentation & Open Source Prep (Day 14)

- [ ] Test all features end-to-end
- [ ] Create comprehensive README with:
  - Project description
  - Features list
  - Prerequisites (Docker, Docker Compose)
  - Quick start guide (clone, setup, run)
  - Screenshots/demo
  - Troubleshooting section
- [ ] Create .env.example files with clear comments
- [ ] Add LICENSE file (MIT/Apache 2.0/GPL - your choice)
- [ ] Create CONTRIBUTING.md for open source contributors
- [ ] Add .gitignore (exclude .env, node_modules, uploads, etc.)
- [ ] Document backup/restore process
- [ ] Create GitHub repository description and tags
- [ ] Optional: Add GitHub Actions for CI/CD

## Environment Variables

### Backend (.env)

```
# Server
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3000

# Database (SQLite - just the file path)
DATABASE_URL="file:./data/database.db"

# JWT Secrets (IMPORTANT: Change these in production!)
JWT_ACCESS_SECRET=change-this-to-random-string-min-32-chars
JWT_REFRESH_SECRET=change-this-to-different-random-string-min-32-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (Optional - only needed for password reset)
# Choose one provider:

# Option 1: Gmail (for development/personal use)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Birthday App

# Option 2: SendGrid (for production)
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_USER=apikey
# SMTP_PASS=your-sendgrid-api-key
# FROM_EMAIL=noreply@yourdomain.com
# FROM_NAME=Birthday App

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5001/api
```

## Tech Stack Summary

### Frontend (Unchanged)

- React 18.2.0
- TypeScript 5.3.3
- Vite 6.3.4
- React Router 6.22.1
- Material-UI 5.15.10
- date-fns 2.30.0

### Backend (New)

- Node.js 20+ LTS
- Express.js 4.x
- TypeScript 5.x
- Prisma 5.x (ORM)
- SQLite 3.x (embedded via Prisma)

### DevOps (New)

- Docker 24+
- Docker Compose 2+

### Libraries to Add

**Backend:**

```json
{
  "express": "^4.18.2",
  "prisma": "^5.7.0",
  "@prisma/client": "^5.7.0",
  "bcrypt": "^5.1.1",
  "@types/bcrypt": "^5.0.2",
  "jsonwebtoken": "^9.0.2",
  "@types/jsonwebtoken": "^9.0.5",
  "cookie-parser": "^1.4.6",
  "@types/cookie-parser": "^1.4.6",
  "multer": "^1.4.5-lts.1",
  "@types/multer": "^1.4.11",
  "nodemailer": "^6.9.7",
  "@types/nodemailer": "^6.4.14",
  "cors": "^2.8.5",
  "@types/cors": "^2.8.17",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "dotenv": "^16.3.1",
  "express-validator": "^7.0.1",
  "typescript": "^5.3.3",
  "ts-node": "^10.9.2",
  "@types/express": "^4.17.21",
  "@types/node": "^20.11.0"
}
```

**Note:** SQLite driver is included with Prisma - no additional database dependencies needed!

**Frontend:**

```json
{
  "axios": "^1.6.2" // or keep using fetch
}
```

### Libraries to Remove

```json
{
  "firebase": "^10.8.0",
  "@firebase/util": "^1.9.3",
  "@firebase/app-types": "^0.9.0",
  "@firebase/firestore-types": "^2.5.0"
}
```

## Key Differences from Firebase

| Feature         | Firebase                      | Self-Hosted                             |
| --------------- | ----------------------------- | --------------------------------------- |
| Auth State      | `onAuthStateChanged` listener | JWT in memory + refresh token in cookie |
| User Data       | `auth.currentUser` object     | Decode JWT or API call                  |
| Database        | Real-time `onSnapshot`        | REST API calls (polling if needed)      |
| File URLs       | Signed URLs from Firebase     | Direct URLs from Express                |
| Password Reset  | Firebase action codes         | Custom tokens in database               |
| Offline Support | Built-in                      | Need to implement (optional)            |

## Removed Features (Consider if needed)

1. **Real-time Data Sync**

   - Firebase: Automatic with `onSnapshot`
   - Options:
     - Remove feature (use periodic refetch)
     - Add WebSocket/Socket.io
     - Use polling with React Query

2. **Offline Persistence**
   - Firebase: Built-in
   - Options:
     - Remove feature
     - Add service workers + IndexedDB

## Security Considerations

1. **Input Validation**: Validate all inputs on backend (express-validator)
2. **Rate Limiting**: Prevent brute force attacks (express-rate-limit)
3. **CORS**: Configure allowed origins
4. **Helmet**: Set security headers
5. **SQL Injection**: Prisma prevents this by default
6. **File Upload**: Validate file type, size, scan for malware
7. **Password Hashing**: bcrypt with salt rounds 10-12
8. **JWT Secrets**: Use strong random strings (32+ chars)
9. **HTTPS**: Use in production (handled by reverse proxy/Nginx)

## Backup Strategy

1. **Database**: Daily MySQL dumps with rotation
2. **Files**: Daily backup of /uploads directory
3. **Docker Volumes**: Mounted to host for persistence
4. **Restore Process**: Document steps to restore from backup

## Future Enhancements

1. Email verification on signup
2. Two-factor authentication (2FA)
3. OAuth providers (Google, Facebook)
4. Real-time sync with Socket.io
5. Upgrade to MinIO for S3 compatibility
6. Add Redis for session storage
7. Implement API versioning
8. Add comprehensive logging (Winston/Pino)
9. Set up monitoring (Prometheus/Grafana)

## Rollback Plan

If migration fails:

1. Keep Firebase config files
2. Don't delete Firebase project until fully tested
3. Can revert frontend changes via git
4. Test in staging environment first

## Success Criteria

- [ ] All existing features work identically
- [ ] User can register, login, logout
- [ ] User can reset password via email
- [ ] User can manage profile and avatar
- [ ] User can CRUD contacts and connections
- [ ] Avatar uploads work for users and contacts
- [ ] Docker compose starts all services
- [ ] No Firebase dependencies in package.json
- [ ] Application runs completely offline (no external services)

## Estimated Timeline

- **Full Migration**: 14 days (working solo, part-time)
- **Minimum Viable**: 7 days (basic features only)
- **With Testing**: +3 days

## Deployment Options

### Option 1: Local Self-Hosted (Recommended for Personal Use)

**Cost: $0** - Runs on your own computer

**Requirements:**

- Computer with Docker installed (Windows/Mac/Linux)
- 1GB RAM minimum (SQLite is lightweight!)
- 2GB disk space (for app + database + uploads)
- Internet connection (for initial Docker image download only)

**Access:**

- Local: `http://localhost:3000`
- Network: `http://192.168.x.x:3000` (from other devices on same WiFi)
- Internet: Optional port forwarding through your router

**Pros:**

- Completely free forever
- Full privacy (data never leaves your computer)
- No dependency on cloud services
- No monthly costs
- Perfect for personal/family use

**Cons:**

- App only available when your computer is running
- Limited to your home network (unless port forwarding)
- You're responsible for backups

### Option 2: VPS/Cloud Hosting (Future Commercial Option)

**Cost: ~$6/month** - For 24/7 public availability

Only needed if you want:

- Application available 24/7 even when your PC is off
- Professional hosting for paying customers
- Better performance and bandwidth
- Public domain (e.g., birthdayapp.com)

**This plan focuses on Option 1** (local self-hosted)

## Example User Installation (After Migration Complete)

A user wanting to use your app would do:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/birthday-project.git
cd birthday-project

# 2. Copy environment files
cp .env.example .env
# (Optional: Edit .env if they want to customize)

# 3. Start the application
docker-compose up

# 4. Open browser
# Navigate to http://localhost:3000

# 5. Create account and start using!
```

That's it! No Firebase setup, no cloud configuration, no API keys to manage.

## Open Source Considerations

### License Choice

Recommend: **MIT License** (most permissive)

- Users can do anything with the code
- Good for community growth
- Allows commercial use by others
- Simple and well-understood

Alternative: **AGPL-3.0** (if you want to ensure modifications stay open)

### Security Notes for Users

Since users will self-host, include in README:

- How to change default secrets (JWT keys)
- Importance of strong passwords
- Backup recommendations
- How to secure if exposing to internet (HTTPS, firewall)
- Optional: fail2ban for brute force protection

### Future Commercial Path

Possible revenue models (later):

1. **Managed Hosting Service**: You host it for users who don't want to self-host
2. **Premium Features**: Core is free, advanced features are paid
3. **Support/Consulting**: Charge for setup help or customization
4. **SaaS Version**: Hosted multi-tenant version with better UX

The open-source version stays free forever, you just add paid options on top.

## Next Steps

1. Add testing with Playwrite
2. ✅ Review this updated plan
3. Start Phase 1: Backend Setup
4. Build the application
5. Test locally with Docker
6. Publish to GitHub
7. Share with community (Reddit, HackerNews, ProductHunt)
8. Gather feedback
9. Decide on commercial path based on response

---

**Ready to start building?** Let me know and I'll begin with Phase 1!
