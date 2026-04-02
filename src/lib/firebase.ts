


let auth: typeof import('firebase/auth').Auth | null = null;
let googleProvider: typeof import('firebase/auth').GoogleAuthProvider | null = null;
let runtimeConfig: typeof firebaseConfig | null = null;


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};


function getConfig() {
  return runtimeConfig || firebaseConfig;
}


async function fetchRuntimeConfig() {
  if (runtimeConfig) return runtimeConfig;
  
  try {
    const response = await fetch('/api/config');
    const data = await response.json();
    if (data.isConfigured && data.firebase) {
      runtimeConfig = data.firebase;
      console.log('🔥 Firebase: Loaded runtime config');
      return runtimeConfig;
    }
  } catch (error) {
    console.warn('🔥 Firebase: Could not fetch runtime config:', error);
  }
  return firebaseConfig;
}

export const getFirebaseAuth = async () => {
  if (typeof window === 'undefined') {
    return { auth: null, googleProvider: null, error: 'Not available on server side' };
  }

  if (auth && googleProvider) {
    return { auth, googleProvider, error: null };
  }

  
  const config = await fetchRuntimeConfig();

  const { initializeApp, getApps } = await import('firebase/app');
  const { getAuth, GoogleAuthProvider } = await import('firebase/auth');

  
  if (!config.apiKey || !config.authDomain || !config.projectId) {
    const missingVars = [];
    if (!config.apiKey) missingVars.push('NEXT_PUBLIC_FIREBASE_API_KEY');
    if (!config.authDomain) missingVars.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
    if (!config.projectId) missingVars.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
    
    console.error('🔥 Firebase configuration is incomplete. Missing:', missingVars.join(', '));
    console.error('🔥 Firebase config:', {
      apiKey: config.apiKey ? `${config.apiKey.substring(0, 10)}...` : 'MISSING',
      authDomain: config.authDomain || 'MISSING',
      projectId: config.projectId || 'MISSING',
    });
    return { 
      auth: null, 
      googleProvider: null, 
      error: `Firebase configuration incomplete. Missing: ${missingVars.join(', ')}` 
    };
  }

  try {
    const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });

    console.log('🔥 Firebase initialized successfully');
    console.log('🔥 Using authDomain:', config.authDomain);
    return { auth, googleProvider, error: null };
  } catch (error) {
    console.error('🔥 Firebase initialization error:', error);
    return { 
      auth: null, 
      googleProvider: null, 
      error: error instanceof Error ? error.message : 'Firebase initialization failed' 
    };
  }
};


export const isFirebaseConfigured = () => {
  const config = getConfig();
  return !!(config.apiKey && config.authDomain && config.projectId);
};


export const getFirebaseConfigStatus = () => {
  const config = getConfig();
  return {
    apiKey: config.apiKey ? '✓ Set' : '✗ Missing',
    authDomain: config.authDomain ? '✓ Set' : '✗ Missing',
    projectId: config.projectId ? '✓ Set' : '✗ Missing',
    isConfigured: isFirebaseConfigured(),
  };
};


export const signInWithGoogleRedirect = async () => {
  const { auth: authInstance, googleProvider: provider, error } = await getFirebaseAuth();
  
  if (error || !authInstance || !provider) {
    return { error: error || 'Firebase not initialized' };
  }
  
  try {
    const { signInWithRedirect } = await import('firebase/auth');
    await signInWithRedirect(authInstance, provider);
    return { error: null };
  } catch (err) {
    console.error('🔥 signInWithRedirect error:', err);
    return { error: err instanceof Error ? err.message : 'Redirect sign-in failed' };
  }
};


export const getGoogleRedirectResult = async () => {
  if (typeof window === 'undefined') {
    return { user: null, error: 'Not available on server side' };
  }
  
  const { auth: authInstance } = await getFirebaseAuth();
  
  if (!authInstance) {
    return { user: null, error: 'Firebase not initialized' };
  }
  
  try {
    const { getRedirectResult } = await import('firebase/auth');
    const result = await getRedirectResult(authInstance);
    
    if (result && result.user) {
      return { 
        user: result.user, 
        error: null 
      };
    }
    
    return { user: null, error: null };
  } catch (err) {
    console.error('🔥 getRedirectResult error:', err);
    return { 
      user: null, 
      error: err instanceof Error ? err.message : 'Failed to get redirect result' 
    };
  }
};

export { auth, googleProvider };
