import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  dark = signal(false);

  init() {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('theme');
    } catch {}
    const dark = saved
      ? saved === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.set(dark);
  }

  set(dark: boolean) {
    document.documentElement.classList.toggle('dark', dark);
    this.dark.set(dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {}
  }

  toggle() {
    this.set(!this.dark());
  }
}