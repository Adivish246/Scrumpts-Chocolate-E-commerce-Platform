import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithRedirect, 
  signOut, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
  UserCredential,
  onAuthStateChanged
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummy-Key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy-project"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy-project"}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = async (): Promise<void> => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signInWithEmail = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

export const signUpWithEmail = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }
    
    return userCredential;
  } catch (error) {
    console.error("Error signing up with email:", error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// User state observer for listening to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Export auth instance
export { auth };
