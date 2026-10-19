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
      const storedMovies = snap.docs.map((d) => d.data() as Movie);
      if (!storedMovies.length) {
        await this.loadFallback();
      } else if (TMDB_API_KEY && storedMovies.length < 20) {
        this.movies.set(storedMovies);
        const tmdbMovies = await this.fetchTmdb();
        this.movies.set(this.mergeMovies(tmdbMovies, storedMovies));
        this.usingSample.set(false);
      } else {
        this.movies.set(storedMovies);
        this.usingSample.set(false);
      }
    } catch {
      if (this.movies().length) {
        this.usingSample.set(false);
      } else {
        await this.loadFallback();
      }
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

  async addMovie(movie: Omit<Movie, 'id'> & { id?: number }) {
    const id = movie.id ?? Date.now();
    const newMovie: Movie = { ...movie, id };
    const updatedMovies = [
      ...this.movies().filter((existing) => existing.id !== id),
      newMovie,
    ];
    const batch = writeBatch(db);
    for (const item of updatedMovies) {
      batch.set(doc(db, 'movies', String(item.id)), item);
    }
    await batch.commit();
    this.movies.set(updatedMovies);
    this.usingSample.set(false);
  }
  private async fetchTmdb(pages = 5): Promise<Movie[]> {
    const requests = Array.from({ length: pages }, (_, i) =>
      fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${i + 1}`
      ).then((r) => {
        if (!r.ok) throw new Error('TMDB error');
        return r.json();
      })
    );

    const results = await Promise.all(requests);

    const byId = new Map<number, Movie>();
    for (const page of results) {
      for (const m of page.results) {
        byId.set(m.id, {
          id: m.id,
          title: m.title,
          year: (m.release_date || '').slice(0, 4),
          rating: Math.round(m.vote_average * 10) / 10,
          poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
          overview: m.overview ?? '',
        });
      }
    }
    return [...byId.values()];
  }

  private mergeMovies(baseMovies: Movie[], overrides: Movie[]) {
    const byId = new Map(baseMovies.map((movie) => [movie.id, movie]));
    for (const movie of overrides) {
      byId.set(movie.id, movie);
    }
    return [...byId.values()];
  }
  private async loadFallback() {
    this.usingSample.set(true);
    if (!TMDB_API_KEY) {
      this.movies.set(SAMPLE);
      return;
    }
    try {
      this.movies.set(await this.fetchTmdb(5)); // 5 pages ≈ 100 movies
      this.usingSample.set(true);
    } catch {
      this.usingSample.set(true);
      this.movies.set(SAMPLE);
    }
  }
}