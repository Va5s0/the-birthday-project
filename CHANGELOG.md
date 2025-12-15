# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-12-12

### Major Changes - Self-Hosted Architecture

This release represents a complete rewrite from Firebase to a self-hosted architecture.

### Added

- **Self-Hosted Backend**: Express.js + TypeScript REST API
- **SQLite Database**: Lightweight, file-based database with Prisma ORM
- **JWT Authentication**: Access and refresh token implementation
- **Docker Support**: Complete Docker Compose setup for easy deployment
- **TanStack Query**: Automatic cache invalidation and data synchronization
- **Health Check Endpoint**: `/health` for monitoring
- **Password Reset**: Email-based password reset with Nodemailer
- **Avatar Upload**: File-based avatar storage system
- **Auto-Migration System**: Prisma migrations for database schema updates
- **Environment Configuration**: Comprehensive .env setup for both frontend and backend

### Changed

- **Architecture**: Migrated from Firebase (Auth, Firestore, Storage) to self-hosted REST API
- **Database**: Changed from Firestore (nested documents) to SQLite (flat schema)
- **Authentication**: Switched from Firebase Auth to JWT tokens
- **File Storage**: Moved from Firebase Storage to local file system
- **Data Structure**: Flattened data model (nameday.date → namedayDate)
- **State Management**: Implemented TanStack Query for server state
- **Build System**: Frontend now uses Vite instead of Create React App
- **Deployment**: Docker-first approach with multi-stage builds

### Removed

- **Firebase Dependencies**: Completely removed all Firebase packages
- **Real-time Sync**: Removed Firestore onSnapshot (replaced with TanStack Query polling)
- **Firebase Storage URLs**: No more signed URLs, using direct file paths

### Fixed

- **TypeScript Errors**: Resolved all type mismatches from migration
- **Session Persistence**: Improved JWT refresh token handling
- **Cache Invalidation**: Auto-refresh after mutations

### Security

- **JWT Secrets**: Environment-based secret management
- **Password Hashing**: bcrypt with configurable salt rounds
- **Input Validation**: Server-side validation for all endpoints
- **CORS Configuration**: Configurable allowed origins
- **HTTP-only Cookies**: Secure refresh token storage

### Technical Details

**Backend Stack:**
- Node.js 20
- Express.js 4.x
- Prisma 5.x
- SQLite 3.x
- TypeScript 5.x
- Nodemailer 6.x

**Frontend Stack:**
- React 18.2
- Vite 6.3
- TanStack Query 5.x
- Material-UI 5.15
- Emotion CSS 11.x

**Infrastructure:**
- Docker & Docker Compose
- Nginx (for production frontend)
- Multi-stage Docker builds

### Migration Guide

For users migrating from v1.x (Firebase version), see [MIGRATION_PLAN.md](MIGRATION_PLAN.md).

**Note**: Data cannot be automatically migrated from Firebase. Manual export/import required.

---

## [1.0.0] - 2024-10-28

### Initial Release - Firebase Version

**Features:**
- Contact management with birthdays and namedays
- Family connections
- Greek nameday automatic search
- Today's celebrations widget
- Avatar uploads
- Card and tree views
- Firebase authentication
- Firestore database
- Firebase Storage

**Stack:**
- React 18.2
- TypeScript 5.3
- Firebase 10.8
- Material-UI 5.15
- Create React App

---

## Versioning Strategy

- **Major version (X.0.0)**: Breaking changes, architecture changes
- **Minor version (0.X.0)**: New features, backwards compatible
- **Patch version (0.0.X)**: Bug fixes, minor improvements

---

## Upcoming

### Planned for v2.1.0
- [ ] End-to-end tests with Playwright
- [ ] Email notifications for upcoming birthdays
- [ ] Import/export contacts (CSV format)
- [ ] Improved error handling and user feedback

### Future Considerations
- [ ] Calendar integration (iCal export)
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Recurring birthday reminders
- [ ] Gift ideas tracker

---

For full details on any release, see the [GitHub Releases](https://github.com/Va5s0/the-birthday-project/releases) page.
