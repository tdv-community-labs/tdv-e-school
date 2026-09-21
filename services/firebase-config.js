/**
 * ============================================================================
 * FAYL ADI: services/firebase-config.js
 * MÆQSÆDÄ°: TDV E-School Firebase Firestore KonfiqurasiyasÄ±
 * ============================================================================
 */

const getSafeEnv = (key) => {
  if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) return window.ENV[key];
  if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  return '';
};

export const firebaseConfig = {
  apiKey: getSafeEnv('FIREBASE_API_KEY') || (typeof localStorage !== 'undefined' ? localStorage.getItem('eschool_firebase_api_key') : '') || '',
  authDomain: getSafeEnv('FIREBASE_AUTH_DOMAIN') || "tdv-e-school.firebaseapp.com",
  projectId: getSafeEnv('FIREBASE_PROJECT_ID') || "tdv-e-school",
  storageBucket: getSafeEnv('FIREBASE_STORAGE_BUCKET') || "tdv-e-school.firebasestorage.app",
  messagingSenderId: getSafeEnv('FIREBASE_MESSAGING_SENDER_ID') || "977781712999",
  appId: getSafeEnv('FIREBASE_APP_ID') || "1:977781712999:web:833aa3e615f5dce6370cc2",
  measurementId: getSafeEnv('FIREBASE_MEASUREMENT_ID') || "G-CZ6XR8V1F6"
};

try {
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    const parsed = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
    Object.assign(firebaseConfig, parsed);
  }
} catch (error) {
  console.error("Error parsing NEXT_PUBLIC_FIREBASE_CONFIG:", error);
}

export const useRealFirebase = true;