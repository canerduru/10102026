import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDiuJM0uk0XN-H48IfoDo5Gsee24Wp_oc8",
  authDomain: "wedding-2026-cb0b4.firebaseapp.com",
  databaseURL: "https://wedding-2026-cb0b4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wedding-2026-cb0b4",
  storageBucket: "wedding-2026-cb0b4.firebasestorage.app",
  messagingSenderId: "799122804598",
  appId: "1:799122804598:web:6d75809c16594bbb83b457",
  measurementId: "G-DFJ2DVRWNZ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);
const storage = getStorage(app);

export { app, db, storage };
