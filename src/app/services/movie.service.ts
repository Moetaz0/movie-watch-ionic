import { Injectable, signal } from '@angular/core';
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { Movie } from '../models/movie';
import { TMDB_API_KEY } from '../config';

const SAMPLE: Movie[] = [
  { id: 1, title: 'Blade Runner', year: '1982', rating: 8.1, poster: null },
  { id: 2, title: 'Alien', year: '1979', rating: 8.4, poster: null },
  { id: 3, title: 'The Godfather', year: '1972', rating: 8.7, poster: null },
  { id: 4, title: 'Parasite', year: '2019', rating: 8.5, poster: null },
  { id: 5, title: 'Inception', year: '2010', rating: 8.4, poster: null },
  { id: 6, title: 'Spirited Away', year: '2001', rating: 8.5, poster: null },
  { id: 7, title: 'Pulp Fiction', year: '1994', rating: 8.5, poster: null },
  { id: 8, title: 'Interstellar', year: '2014', rating: 8.4, poster: null },
];

@Injectable({ providedIn: 'root' })
export class MovieService {
  movies = signal<Movie[]>([]);
  loading = signal(false);
  usingSample = signal(false);

  async load() {
    if (this.movies().length) return;
    this.loading.set(true);
    try {
      const snap = await getDocs(collection(db, 'movies'));
      if (!snap.empty) {
        this.movies.set(snap.docs.map((d) => d.data() as Movie));
        this.usingSample.set(false);
      } else {
        await this.loadFallback();
      }
    } catch {
      await this.loadFallback();
    } finally {
      this.loading.set(false);
    }
  }

  /** Admin only: copies the displayed movies into Firestore. */
  async importToFirestore() {
    const batch = writeBatch(db);
    for (const m of this.movies()) {
      batch.set(doc(db, 'movies', String(m.id)), m);
    }
    await batch.commit();
    this.usingSample.set(false);
  }

  private async loadFallback() {
    this.usingSample.set(true);
    if (!TMDB_API_KEY) {
      this.movies.set(SAMPLE);
      return;
    }
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      this.movies.set(
        data.results.map((m: any) => ({
          id: m.id,
          title: m.title,
          year: (m.release_date || '').slice(0, 4),
          rating: Math.round(m.vote_average * 10) / 10,
          poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
        }))
      );
    } catch {
      this.movies.set(SAMPLE);
    }
  }
}