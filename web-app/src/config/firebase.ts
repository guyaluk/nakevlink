import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getDataConnect, connectDataConnectEmulator } from '@firebase/data-connect';

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
export const dataConnect = getDataConnect(app);

// Connect to emulators if in development
if (import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true') {
  // Auth emulator
  if (!auth.emulatorConfig) {
    connectAuthEmulator(auth, import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL);
  }
  
  // Firestore emulator
  if (!db._delegate._databaseId.database.includes('(default)')) {
    connectFirestoreEmulator(
      db, 
      import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_HOST,
      Number(import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_PORT)
    );
  }
  
  // Functions emulator
  if (!functions._delegate._region.includes('emulator')) {
    connectFunctionsEmulator(functions, 'localhost', 5001);
  }
  
  // Data Connect emulator
  connectDataConnectEmulator(dataConnect, 'localhost', 9399);
}

export { app };