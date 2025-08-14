import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithRedirect, signOut as firebaseSignOut, onAuthStateChanged, User, signInWithPopup } from "firebase/auth";
import { app } from "./firebase"; // Assuming 'app' is exported from firebase.ts

// Auth functions
export const auth = getAuth(app);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const register = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to register');
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

// Handle redirect result after Google sign-in
export function handleRedirect() {
  if (!auth) {
    return Promise.resolve(null);
  }

  return getRedirectResult(auth)
    .then((result: any) => {
      if (result) {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log("User signed in:", user.displayName);
        return user;
      }
      return null;
    })
    .catch((error: any) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData?.email;
      const credential = GoogleAuthProvider.credentialFromError(error);

      console.error("Firebase auth error:", { errorCode, errorMessage, email });
      throw error;
    });
}

// Sign in with Google redirect
export function signInWithGoogleRedirect() { // Renamed to avoid conflict and clarify usage
  if (!auth || !GoogleAuthProvider) {
    console.warn("Firebase not configured or Google provider not available. Please add Firebase credentials to enable authentication.");
    return Promise.resolve();
  }
  const provider = new GoogleAuthProvider();
  return signInWithRedirect(auth, provider);
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!auth) {
    setTimeout(() => callback(null), 0);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}