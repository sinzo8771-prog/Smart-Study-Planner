// Firebase is only initialized on the client side
// Environment variables are embedded at build time

let auth: typeof import('firebase/auth').Auth | null = null;
let googleProvider: typeof import('firebase/auth').GoogleAuthProvider | null = null;

// Firebase config - values are embedded at build time
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
};

export const getFirebaseAuth = async () => {
  if (typeof window === 'undefined') {
    return { auth: null, googleProvider: null };
  }

  if (auth && googleProvider) {
    return { auth, googleProvider };
  }

  const { initializeApp, getApps } = await import('firebase/app');
  const { getAuth, GoogleAuthProvider } = await import('firebase/auth');

  // Validate config
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    console.error('Firebase configuration is incomplete:', {
      hasApiKey: !!firebaseConfig.apiKey,
      hasAuthDomain: !!firebaseConfig.authDomain,
      hasProjectId: !!firebaseConfig.projectId,
    });
    return { auth: null, googleProvider: null };
  }

  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });

    return { auth, googleProvider };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return { auth: null, googleProvider: null };
  }
};

// Helper to check if Firebase is configured
export const isFirebaseConfigured = () => {
  return !!(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);
};

export { auth, googleProvider };
