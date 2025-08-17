import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Connect to emulators if in development
console.log('Firebase config: USE_EMULATOR =', import.meta.env.VITE_FIREBASE_USE_EMULATOR);
console.log('Firebase config: PROJECT_ID =', import.meta.env.VITE_FIREBASE_PROJECT_ID);

if (import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true') {
  try {
    console.log('Firebase: Attempting to connect to Auth emulator at localhost:8199');
    // Auth emulator
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, 'http://localhost:8199');
      console.log('Firebase: Successfully connected to Auth emulator');
    } else {
      console.log('Firebase: Auth emulator already configured');
    }
  } catch (error) {
    console.warn('Firebase: Failed to connect to Auth emulator:', error);
  }
} else {
  console.log('Firebase: Using production Firebase (emulator disabled)');
}

export { app };