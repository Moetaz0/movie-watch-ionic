import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCyv75M6yTkl4pzvV-JJ-KuhoTSVXDNmzc',
  authDomain: 'movie-match-55990.firebaseapp.com',
  projectId: 'movie-match-55990',
  storageBucket: 'movie-match-55990.firebasestorage.app',
  messagingSenderId: '935431197163',
  appId: '1:935431197163:web:41cdd8dc6e0d4ebdb949ae',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);