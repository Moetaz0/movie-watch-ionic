import { Injectable, inject, signal } from '@angular/core';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { AppUser, AuthService } from './auth.service';

export const MATCH_THRESHOLD = 75;

export interface Match {
  user: AppUser;
  rate: number;
  common: number[];
}

/** Jaccard similarity: |A ∩ B| / |A ∪ B| × 100 */
export function matchRate(a: number[], b: number[]) {
  const setA = new Set(a);
  const setB = new Set(b);
  const common = [...setA].filter((x) => setB.has(x));
  const union = new Set([...setA, ...setB]).size;
  return { rate: union === 0 ? 0 : (common.length / union) * 100, common };
}

@Injectable({ providedIn: 'root' })
export class MatchService {
  private auth = inject(AuthService);

  matches = signal<Match[]>([]);
  compared = signal(0);
  loading = signal(false);
  error = signal('');

  async compute() {
    const me = this.auth.currentUser();
    if (!me) return;

    this.loading.set(true);
    this.error.set('');
    try {
      const snap = await getDocs(collection(db, 'users'));
      const others = snap.docs
        .map((d) => ({ ...(d.data() as AppUser), id: d.id }))
        .filter((u) => u.id !== me.id && u.active)
        .map((u) => ({ ...u, favoriteMovieIds: u.favoriteMovieIds ?? [] }));

      this.compared.set(others.length);

      const result = others
        .map((u) => {
          const { rate, common } = matchRate(me.favoriteMovieIds, u.favoriteMovieIds);
          return { user: u, rate, common };
        })
        .filter((m) => m.rate >= MATCH_THRESHOLD) // use ">" if "dépasser" must be strict
        .sort((a, b) => b.rate - a.rate);

      this.matches.set(result);
    } catch {
      this.error.set('Impossible de charger les utilisateurs.');
    } finally {
      this.loading.set(false);
    }
  }
}