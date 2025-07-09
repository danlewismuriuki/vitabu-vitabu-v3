// src/utils/firebaseAuth.ts

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  UserCredential,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "firebase/auth";
import { auth } from "../firebase";

// 🔐 Sign up a new user
export const signUp = async (email: string, password: string): Promise<UserCredential> => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// 🔐 Sign in existing user
export const logIn = async (
  email: string,
  password: string,
  rememberMe: boolean = true
): Promise<UserCredential> => {
  await setPersistence(
    auth,
    rememberMe ? browserLocalPersistence : browserSessionPersistence
  )
  return await signInWithEmailAndPassword(auth, email, password);
};

// 🔐 Send password reset email
export const forgotPassword = async (email: string): Promise<void> => {
  return await sendPasswordResetEmail(auth, email);
};

// 🔐 Login with Google
export const loginWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

// 🔐 Login with Facebook
export const loginWithFacebook = async (): Promise<UserCredential> => {
  const provider = new FacebookAuthProvider();
  return await signInWithPopup(auth, provider);
};

// 🔐 Logout
export const logOut = async (): Promise<void> => {
  return await signOut(auth);
};

// ✅ Get the current user from Firebase Auth
export const getCurrentUser = () => auth.currentUser;

// ✅ Get and store the token in localStorage or memory
export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken(/* forceRefresh */ true);
  }
  return null;
};

// ✅ Check if token is still valid
export const isTokenValid = () => {
  const user = auth.currentUser;
  return !!user;
};

// ✅ Refresh the token if needed (Firebase handles this mostly, but we force-refresh)
export const refreshTokenIfNeeded = async () => {
  const user = auth.currentUser;
  if (user) {
    await user.getIdToken(true);
  }
};

