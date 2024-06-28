
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import cookie from 'js-cookie';

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // await createUserIfNotExists(user);
    return user;
  } catch (error) {
    console.log("Error Signing up:", error);
    throw error;
  }
};

export const googleSignUp = async () => {
  const googleProvider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    // await createUserIfNotExists(user);
    return user;
  } catch (error) {
    console.log("Error Signing up:", error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // await createUserIfNotExists(user);
    return user;
  } catch (error) {
    console.error("Error singing in:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    // Clear the isAdmin cookie
    cookie.remove('isAdmin');
    console.log('isAdmin cookie removed');

    // Sign out the user
    await signOut(auth);
    console.log('Signed out');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const authStateListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
