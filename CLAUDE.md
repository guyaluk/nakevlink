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
   - React app: http://localhost:3005 (current development port)
   - Firebase UI: http://localhost:4100 (when emulators running)

## ✅ Real Firebase Authentication System (Current Status)

### **Production-Ready Features**
- **Real Firebase Authentication**: Production Firebase Auth with emulator support
- **Complete Authentication Flow**: Login, Signup, Logout, Role-based routing
- **Customer Signup**: Name, email, password, favorite category selection
- **Business Signup**: Personal info + business details (name, category, contact info, punch card settings)
- **Role-Based Authentication**: Customers redirect to `/customers`, Business owners to `/business`
- **Firebase Persistence**: Authentication persists across page refreshes
- **Custom Claims Ready**: Firebase Functions for role management
- **Error Boundaries**: Comprehensive error handling and recovery
- **Loading States**: Proper loading indicators during Firebase operations

### **Technology Stack**
- **Frontend**: React 19, TypeScript, Vite
- **UI Components**: shadcn/ui with Tailwind CSS v4
- **Routing**: React Router DOM
- **Authentication**: Real Firebase Auth with TypeScript support
- **State Management**: React Context with Firebase integration
- **Firebase**: Auth, Functions, Emulators
- **Error Handling**: ErrorBoundary component
- **Icons**: Lucide React

### **Component Structure**
```
web-app/src/
├── components/
│   ├── ui/                           # shadcn/ui components
│   └── auth/
│       ├── Login.tsx                 # Firebase-integrated login form
│       ├── RoleSelection.tsx         # Customer vs Business role selection
│       ├── SimpleCustomerSignup.tsx # Customer signup form
│       └── SimpleBusinessSignup.tsx # Business signup form
├── contexts/
│   └── AuthContext.tsx              # Authentication state management
└── constants/
    └── categories.ts                 # Business categories (fitness, coffee, etc.)
```

### **Current Routes**
- `/` - Login page
- `/login` - Login page
- `/signup` - Role selection (Customer vs Business Owner)
- `/signup/customer` - Customer signup form
- `/signup/business` - Business signup form  
- `/customers` - Customer dashboard (role-protected)
- `/business` - Business dashboard (role-protected)

### **Testing the Authentication System**
1. **Customer Flow**: Signup → Dashboard → Logout → Login → Dashboard
2. **Business Flow**: Signup → Dashboard → Logout → Login → Dashboard
3. **Role Validation**: Business users redirect to `/business`, customers to `/customers`
4. **Persistence**: Users persist across page refreshes and code changes

### **Next Development Steps**
- Replace mock authentication with real Firebase Auth
- Add Firebase Functions for setting custom claims (roles)
- Integrate Data Connect for user/business data storage
- Add protected route components with role validation
- Implement dashboard functionality (punch cards, business management)

## Important Notes

- **Current State**: Real Firebase Authentication (production-ready)
- **Firebase Setup**: Emulators actively running for local development
- **Mobile-First**: All components designed mobile-first with responsive breakpoints
- **Development Port**: App runs on http://localhost:3005+ (auto-assigned by Vite)

### **Firebase Configuration**
- **Auth Emulator**: localhost:8199 (configured and working)
- **Functions Emulator**: localhost:6201 (running with custom claims functions)
- **Emulator UI**: localhost:3200 (Firebase dashboard for debugging)
- **Environment**: `.env.local` with VITE_FIREBASE_USE_EMULATOR=true
- **TypeScript**: Proper `import type` syntax for Firebase types
- **Error Recovery**: 5-second timeout and fallback handling