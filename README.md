# Nakevlink

A mobile-first web application built with modern technologies.

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Backend**: Firebase (Auth, Firestore, Functions)
- **Development**: Firebase Emulator Suite
- **Styling**: Mobile-first responsive design

## Quick Start

1. **Install dependencies**:
   ```bash
   cd web-app && npm install
   npm install -g firebase-tools concurrently
   ```

2. **Setup Firebase** (first time only):
   ```bash
   firebase login
   firebase projects:create your-project-id
   ```

3. **Start development**:
   ```bash
   # Start Firebase emulators
   firebase emulators:start
   
   # In another terminal, start React app
   cd web-app && npm run dev
   ```

4. **Access the app**:
   - React app: http://localhost:3000
   - Firebase UI: http://localhost:4000

## Development

See [CLAUDE.md](./CLAUDE.md) for detailed development information and architecture overview.

## Features

- ⚡ Fast development with Vite HMR
- 📱 Mobile-first responsive design
- 🔥 Local Firebase emulators for offline development
- 🚀 Easy deployment switching between local/cloud environments
- 🔧 Modern TypeScript setup

## Environment Configuration

Copy `web-app/.env.example` to `web-app/.env.local` and update with your Firebase project configuration for production deployment.