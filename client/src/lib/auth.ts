import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithRedirect, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

// Handle redirect result after Google sign-in
export function handleRedirect() {
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
  return signInWithRedirect(auth, googleProvider);
}

// Sign out
export function signOutUser() {
  return signOut(auth);
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}