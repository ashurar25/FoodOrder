import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithRedirect, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "./firebase";

// Handle redirect result after Google sign-in
export function handleRedirect() {
  if (!isFirebaseConfigured() || !auth) {
    return Promise.resolve(null);
  }
  
  return getRedirectResult(auth)
    .then((result: any) => {
      if (result) {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        
        // The signed-in user info.
        const user = result.user;
        console.log("User signed in:", user.displayName);
        return user;
      }
      return null;
    })
    .catch((error: any) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData?.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      
      console.error("Firebase auth error:", { errorCode, errorMessage, email });
      throw error;
    });
}

// Sign in with Google redirect
export function signInWithGoogle() {
  if (!isFirebaseConfigured() || !auth || !googleProvider) {
    console.warn("Firebase not configured. Please add Firebase credentials to enable authentication.");
    return Promise.resolve();
  }
  return signInWithRedirect(auth, googleProvider);
}

// Sign out
export function signOutUser() {
  if (!isFirebaseConfigured() || !auth) {
    return Promise.resolve();
  }
  return signOut(auth);
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!isFirebaseConfigured() || !auth) {
    // Return a no-op unsubscribe function when Firebase is not configured
    setTimeout(() => callback(null), 0);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// Register function (placeholder - this should use your backend registration API)
export async function register(email: string, password: string) {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name: email.split('@')[0] }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const result = await response.json();
    return result.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}