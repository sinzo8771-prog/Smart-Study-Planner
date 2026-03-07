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
    return { auth: null, googleProvider: null, error: 'Not available on server side' };
  }

  if (auth && googleProvider) {
    return { auth, googleProvider, error: null };
  }

  const { initializeApp, getApps } = await import('firebase/app');
  const { getAuth, GoogleAuthProvider } = await import('firebase/auth');

  // Validate config
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    const missingVars = [];
    if (!firebaseConfig.apiKey) missingVars.push('NEXT_PUBLIC_FIREBASE_API_KEY');
    if (!firebaseConfig.authDomain) missingVars.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
    if (!firebaseConfig.projectId) missingVars.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
    
    console.error('Firebase configuration is incomplete. Missing:', missingVars.join(', '));
    return { 
      auth: null, 
      googleProvider: null, 
      error: `Firebase configuration incomplete. Missing: ${missingVars.join(', ')}` 
    };
  }

  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    // Add scopes for better user info
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });

    console.log('Firebase initialized successfully');
    return { auth, googleProvider, error: null };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return { 
      auth: null, 
      googleProvider: null, 
      error: error instanceof Error ? error.message : 'Firebase initialization failed' 
    };
  }
};

// Helper to check if Firebase is configured
export const isFirebaseConfigured = () => {
  return !!(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);
};

// Get Firebase config status for debugging
export const getFirebaseConfigStatus = () => {
  return {
    apiKey: firebaseConfig.apiKey ? '✓ Set' : '✗ Missing',
    authDomain: firebaseConfig.authDomain ? '✓ Set' : '✗ Missing',
    projectId: firebaseConfig.projectId ? '✓ Set' : '✗ Missing',
    isConfigured: isFirebaseConfigured(),
  };
};

export { auth, googleProvider };
