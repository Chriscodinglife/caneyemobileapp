import { initializeApp } from 'firebase/app';
// Optionally import the services that you want to use
import { getDatabase } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'; // Import the persistence function
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAIn6bg3d2lN1fgBknxN2td4miEnt8ZHhg',
  authDomain: 'caneyedb-default-rtdb.firebaseio.com',
  databaseURL: 'https://caneyedb-default-rtdb.firebaseio.com',
  projectId: 'caneyedb',
  storageBucket: 'caneyedb.appspot.com',
  messagingSenderId: '36704541290',
  appId: '1:36704541290:ios:20af3a81883edb80438813',
  measurementId: '6065323971',
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

const storage = getStorage(app)
const machineDB = getDatabase(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { machineDB, auth, storage };