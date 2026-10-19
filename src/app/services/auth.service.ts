import { Injectable, signal } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export interface AppUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  photo: string | null;
  role: 'user' | 'admin';
  active: boolean;
  favoriteMovieIds: number[];
  theme?: 'light' | 'dark';
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  photo: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<AppUser | null>(null);
  /** Resolves once Firebase has restored (or not) the previous session. */
  ready: Promise<void>;
  private registering = false;

  constructor() {
    this.ready = new Promise((resolve) => {
      onAuthStateChanged(auth, async (fbUser) => {
        if (this.registering) return;
        try {
          await this.loadProfile(fbUser);
        } catch {
          this.currentUser.set(null);
        } finally {
          resolve();
        }
      });
    });
  }

  async register(data: RegisterData) {
    this.registering = true;
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password
      );
      const profile: AppUser = {
        id: cred.user.uid,
        email: data.email.trim().toLowerCase(),
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age,
        photo: data.photo,
        role: 'user',
        active: true,
        favoriteMovieIds: [],
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      };
      await setDoc(doc(db, 'users', cred.user.uid), profile);
      this.currentUser.set(profile);
    } catch (e) {
      throw new Error(this.friendly(e));
    } finally {
      this.registering = false;
    }
  }

  async login(email: string, password: string) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const profile = await this.fetchProfile(cred.user.uid);
      if (!profile) throw new Error('Profil introuvable.');
      if (!profile.active) {
        await signOut(auth);
        throw new Error('Ce compte a été désactivé par un administrateur.');
      }
      this.currentUser.set(profile);
    } catch (e) {
      throw new Error(this.friendly(e));
    }
  }

  async logout() {
    await signOut(auth);
    this.currentUser.set(null);
  }

  /** Used by other services for instant UI updates. */
  patchLocal(changes: Partial<AppUser>) {
    const u = this.currentUser();
    if (u) this.currentUser.set({ ...u, ...changes });
  }

  async listUsers(): Promise<AppUser[]> {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map((user) => {
      const data = user.data() as AppUser;
      return { ...data, id: user.id, favoriteMovieIds: data.favoriteMovieIds ?? [] };
    });
  }

  async deactivateUser(userId: string) {
    if (userId === this.currentUser()?.id) {
      throw new Error('Un administrateur ne peut pas désactiver son propre compte.');
    }
    await updateDoc(doc(db, 'users', userId), { active: false });
  }

  async activateUser(userId: string) {
    await updateDoc(doc(db, 'users', userId), { active: true });
  }

  private async fetchProfile(uid: string): Promise<AppUser | null> {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    const d = snap.data() as AppUser;
    return { ...d, id: uid, favoriteMovieIds: d.favoriteMovieIds ?? [] };
  }

  private async loadProfile(fbUser: User | null) {
    if (!fbUser) {
      this.currentUser.set(null);
      return;
    }
    const profile = await this.fetchProfile(fbUser.uid);
    if (profile?.active) {
      this.currentUser.set(profile);
    } else {
      await signOut(auth);
      this.currentUser.set(null);
    }
  }

  private friendly(e: any): string {
    switch (e?.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Email ou mot de passe incorrect.';
      case 'auth/email-already-in-use':
        return 'Cet email est déjà utilisé.';
      case 'auth/weak-password':
        return 'Mot de passe trop faible (6 caractères minimum).';
      case 'auth/network-request-failed':
        return 'Problème de connexion réseau.';
      case 'permission-denied':
        return "Accès refusé par les règles Firestore.";
      default:
        return e?.message ?? 'Une erreur est survenue.';
    }
  }
}