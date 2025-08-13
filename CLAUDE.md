# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nakevlink is a mobile-first web application built with Vite + React + TypeScript for the frontend and Firebase for the backend. The project supports both local development with Firebase emulators and cloud deployment.

## Development Commands

### Frontend (React App)
- **Start development server**: `cd web-app && npm run dev` (accessible on mobile via --host flag)
- **Build**: `cd web-app && npm run build`
- **Lint**: `cd web-app && npm run lint`
- **Preview build**: `cd web-app && npm run preview`

### Firebase Backend
- **Start emulators**: `firebase emulators:start`
- **Start emulators (from web-app)**: `npm run emulators`

### Full Development Workflow
- **Start both React and Firebase emulators**: `cd web-app && npm run dev:full` (requires concurrently package)

## Architecture

### Frontend Structure
```
web-app/
├── src/
│   ├── config/
│   │   └── firebase.ts          # Firebase configuration with emulator support
│   ├── components/              # React components
│   ├── hooks/                   # Custom React hooks
│   └── utils/                   # Utility functions
├── public/                      # Static assets
└── dist/                        # Build output
```

### Firebase Structure
```
├── firebase.json                # Firebase configuration
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Firestore indexes
└── functions/                   # Cloud Functions (when created)
```

### Key Technologies
- **Frontend**: Vite, React 19, TypeScript
- **Backend**: Firebase (Auth, Firestore, Functions)
- **Development**: Firebase Emulator Suite
- **Styling**: Mobile-first CSS (ready for Tailwind CSS)

## Environment Configuration

### Local Development
- Uses `.env.local` in web-app folder
- `VITE_FIREBASE_USE_EMULATOR=true` enables emulator connections
- All Firebase services connect to local emulators

### Production Deployment
- Copy `.env.example` to `.env.local` and update with real Firebase config
- Set `VITE_FIREBASE_USE_EMULATOR=false`
- Deploy via `firebase deploy`

## Firebase Emulators

Configured emulators:
- **Auth**: localhost:9099
- **Firestore**: localhost:8080  
- **Functions**: localhost:5001
- **Hosting**: localhost:5000
- **Emulator UI**: localhost:4000

## Mobile-First Setup

- Vite dev server runs with `--host` flag for mobile device testing
- Responsive viewport meta tags configured
- Touch-optimized CSS properties
- Minimum width: 320px (mobile-first)

## Getting Started

1. **Setup Firebase project** (required for first-time setup):
   ```bash
   firebase login
   firebase projects:create your-project-id
   ```

2. **Install dependencies**:
   ```bash
   cd web-app && npm install
   npm install -g firebase-tools concurrently
   ```

3. **Start development**:
   ```bash
   # Terminal 1: Start Firebase emulators
   firebase emulators:start
   
   # Terminal 2: Start React dev server
   cd web-app && npm run dev
   ```

4. **Access application**:
   - React app: http://localhost:3000
   - Firebase UI: http://localhost:4000

## Important Notes

- Firebase SDK installation may need to be completed manually due to path issues
- Update Firebase config in `web-app/src/config/firebase.ts` with your project credentials
- Mobile testing available via network IP when using `--host` flag