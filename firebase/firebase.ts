
import { auth } from '../firebaseConfig'
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  NextOrObserver,
  User
} from 'firebase/auth';

export const signInUser = async (
  email: string, 
  password: string
) => {
  if (!email && !password) return;

  return await signInWithEmailAndPassword(auth, email, password)
}

export const createUser = async (
    email: string, 
    password: string
  ) => {
    if (!email && !password) return;
  
    return await createUserWithEmailAndPassword(auth, email, password)
}

export const userStateListener = (callback:NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback)
}

export const SignOutUser = async () => await signOut(auth);
