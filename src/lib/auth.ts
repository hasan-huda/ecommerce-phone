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
import { useState, useEffect } from "react";

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.log("Error Signing up:", error);
    throw error;
  }
};

export const googleSignUp = async () => {
  const googleProvider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    console.log(userCredential.user);
    return userCredential.user;
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
    return userCredential.user;
  } catch (error) {
    console.error("Error singing in:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const authStateListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

export const useAuth = () => {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = authStateListener((user) => {
      setUser(user);
      if (user && adminEmail) {
        setIsAdmin(adminEmail === user.email);
      } else {
        setIsAdmin(false);
      }
    });
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return { user, isAdmin };
};