import { Injectable, effect, inject, signal } from '@angular/core';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private auth = inject(AuthService);

  dark = signal(false);

  constructor() {
    // whenever a profile loads (login, session restore), use its saved theme
    effect(() => {
      const saved = this.auth.currentUser()?.theme;
      if (saved) this.apply(saved === 'dark');
    });
  }

  /** First paint: use the local cache, or the system preference. */
  init() {
    let cached: string | null = null;
    try {
      cached = localStorage.getItem('theme');
    } catch {}
    const dark = cached
      ? cached === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.apply(dark);
  }

  async toggle() {
    const previous = this.dark();
    const next = !previous;
    this.apply(next);

    const user = this.auth.currentUser();
    if (!user) return; // not logged in: local only

    const theme = next ? 'dark' : 'light';
    this.auth.patchLocal({ theme });
    try {
      await updateDoc(doc(db, 'users', user.id), { theme });
    } catch {
      this.auth.patchLocal({ theme: previous ? 'dark' : 'light' });
      this.apply(previous);
    }
  }

  private apply(dark: boolean) {
    document.documentElement.classList.toggle('dark', dark);
    this.dark.set(dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {}
  }
}