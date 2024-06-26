
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
import { db } from "@/db";
// import { useState, useEffect } from "react";

// export const createUserIfNotExists = async (user: User) => {
//   const existingUser = await db.user.findFirst({
//     where: { id: user.uid },
//   });

//   if (!existingUser) {
//     console.log("Creating user")
//     await db.user.create({
//       data: {
//         id: user.uid,
//         email: user.email || "",
//       },
//     });
//   }
// };

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
    console.log("Signed out");
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
