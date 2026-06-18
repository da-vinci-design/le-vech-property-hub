import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuration from /firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyAwgY_wQPfPMFQdLVocxGZSV6gQnYBuK48",
  authDomain: "dark-bebop-t67s8.firebaseapp.com",
  projectId: "dark-bebop-t67s8",
  storageBucket: "dark-bebop-t67s8.firebasestorage.app",
  messagingSenderId: "187572781700",
  appId: "1:187572781700:web:7ad78bb793b72a68dc38d1"
};

let app;
let db: any;
let auth: any;
let isFirebaseEnabled = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId !== '') {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    // Initialize Firestore with custom databaseId if required, else default
    // The databaseId in config is "ai-studio-aacbb85f-1958-4206-ba3e-496d258f29a9"
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    }, "ai-studio-aacbb85f-1958-4206-ba3e-496d258f29a9");
    auth = getAuth(app);
    isFirebaseEnabled = true;
    console.log('Firebase initialized successfully with Firestore databaseID:', "ai-studio-aacbb85f-1958-4206-ba3e-496d258f29a9");
  }
} catch (error) {
  console.warn('Firebase initialization failed, falling back to LocalStorage system:', error);
}

export { db, auth, isFirebaseEnabled };
