import { Injectable, computed, inject } from '@angular/core';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private auth = inject(AuthService);

  ids = computed(() => this.auth.currentUser()?.favoriteMovieIds ?? []);

  has(id: number) {
    return this.ids().includes(id);
  }

  async toggle(id: number) {
    const user = this.auth.currentUser();
    if (!user) return;

    const previous = this.ids();
    const adding = !previous.includes(id);
    // update the UI immediately, then save
    this.auth.patchLocal({
      favoriteMovieIds: adding ? [...previous, id] : previous.filter((x) => x !== id),
    });
    try {
      await updateDoc(doc(db, 'users', user.id), {
        favoriteMovieIds: adding ? arrayUnion(id) : arrayRemove(id),
      });
    } catch {
      this.auth.patchLocal({ favoriteMovieIds: previous }); // roll back
    }
  }
}