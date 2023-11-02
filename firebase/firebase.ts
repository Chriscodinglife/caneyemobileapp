
import { auth } from '../firebaseConfig'
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  NextOrObserver,
  deleteUser,
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

export const deleteUserAccount = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      await deleteUser(user);

      return true;
      // The user account has been successfully deleted.
    } catch (error) {
      // Handle any errors that may occur during account deletion.
      console.error('Error deleting user account:', error);
    }
  } else {
    console.log("No user is logged in");
  };

};