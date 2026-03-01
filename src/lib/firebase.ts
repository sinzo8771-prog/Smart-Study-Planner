// Firebase is only initialized on the client side
// This file should only be imported in client components

let auth: typeof import('firebase/auth').Auth | null = null;
let googleProvider: typeof import('firebase/auth').GoogleAuthProvider | null = null;

export const getFirebaseAuth = async () => {
  if (typeof window === 'undefined') {
    return { auth: null, googleProvider: null };
  }

  if (auth && googleProvider) {
    return { auth, googleProvider };
  }

  const { initializeApp, getApps } = await import('firebase/app');
  const { getAuth, GoogleAuthProvider } = await import('firebase/auth');

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  
  googleProvider.setCustomParameters({
    prompt: 'select_account',
  });

  return { auth, googleProvider };
};

export { auth, googleProvider };
