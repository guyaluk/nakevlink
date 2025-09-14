import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
import { connectorConfig } from '@/lib/dataconnect/esm/index.esm.js';

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
export const dataConnect = getDataConnect(app, connectorConfig);

// Connect to emulators if in development
console.log('Firebase config: USE_EMULATOR =', import.meta.env.VITE_FIREBASE_USE_EMULATOR);
console.log('Firebase config: PROJECT_ID =', import.meta.env.VITE_FIREBASE_PROJECT_ID);

if (import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true') {
  try {
    console.log('Firebase: Attempting to connect to emulators');
    
    // Determine the emulator host - use the current page's hostname if not localhost
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const emulatorHost = isLocalhost ? 'localhost' : window.location.hostname;
    
    console.log(`Firebase: Using emulator host: ${emulatorHost} (detected from ${window.location.hostname})`);
    
    // Auth emulator
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, `http://${emulatorHost}:9099`);
      console.log(`Firebase: Successfully connected to Auth emulator at ${emulatorHost}:9099`);
    } else {
      console.log('Firebase: Auth emulator already configured');
    }
    
    // Functions emulator
    try {
      connectFunctionsEmulator(functions, emulatorHost, 5001);
      console.log(`Firebase: Successfully connected to Functions emulator at ${emulatorHost}:5001`);
    } catch (functionsError: any) {
      if (functionsError.message?.includes('already')) {
        console.log('Firebase: Functions emulator already configured');
      } else {
        console.warn('Firebase: Failed to connect to Functions emulator:', functionsError);
      }
    }
    
    // Firestore emulator
    try {
      const firestoreHost = import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_HOST || emulatorHost;
      const firestorePort = parseInt(import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_PORT || '8080');
      connectFirestoreEmulator(db, firestoreHost, firestorePort);
      console.log(`Firebase: Successfully connected to Firestore emulator at ${firestoreHost}:${firestorePort}`);
    } catch (firestoreError: any) {
      if (firestoreError.message?.includes('already')) {
        console.log('Firebase: Firestore emulator already configured');
      } else {
        console.warn('Firebase: Failed to connect to Firestore emulator:', firestoreError);
      }
    }
    
    // Data Connect emulator
    try {
      connectDataConnectEmulator(dataConnect, emulatorHost, 9399);
      console.log(`Firebase: Successfully connected to Data Connect emulator at ${emulatorHost}:9399`);
    } catch (dataConnectError: any) {
      if (dataConnectError.message?.includes('already')) {
        console.log('Firebase: Data Connect emulator already configured');
      } else {
        console.warn('Firebase: Failed to connect to Data Connect emulator:', dataConnectError);
      }
    }
  } catch (error) {
    console.warn('Firebase: Failed to connect to emulators:', error);
  }
} else {
  console.log('Firebase: Using production Firebase (emulator disabled)');
}

export { app };