
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

/**
 * ✅ NEW CLIENT FIREBASE KEYS
 * Firebase Console -> Project Settings -> General -> Web Apps se copy karein.
 */
const firebaseConfig = {
  apiKey: "AIzaSyC1LZEoRcctG9prkgUemsaQtdn30oSYInk",
  authDomain: "barber-app-fbf5c.firebaseapp.com",
  projectId: "barber-app-fbf5c",
  storageBucket: "barber-app-fbf5c.firebasestorage.app",
  messagingSenderId: "392401169789",
  appId: "1:392401169789:web:846975298f62e7cb683014",
  measurementId: "G-T3BGNZ979J"
};

/**
 * ✅ WEB PUSH VAPID KEY
 * Firebase Console -> Cloud Messaging -> Web Configuration -> Generate Key.
 */
export const VAPID_KEY = "BM3GGUTVTnYeI37YoUIPzl_wOoqVna6hGsfRO2VrZ3gIKuEU6vcpaCivqsGKvnqNeyPGgsrTmD1v9_IP_QIRW4gBORooIlxMRrsxd2v7yr5ZBAM3JhAHA_ZTNthHZhEoZLMrrZx2h4PEgUEMjFXrrroKONiyDIVNomSDwnhSnaAa-c";

export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY" && 
         !firebaseConfig.apiKey.includes("YOUR_");
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export const requestForToken = async () => {
  if (!messaging || !isFirebaseConfigured()) return null;
  
  if (!("Notification" in window)) return null;

  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }

  if (Notification.permission !== 'granted') return null;

  try {
    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    return currentToken;
  } catch (err) {
    console.error('FCM Token Error:', err);
    return null;
  }
};
