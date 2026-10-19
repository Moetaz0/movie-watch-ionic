import { Component, OnInit, inject, signal } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, AppUser } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  imports: [IonContent, ReactiveFormsModule, RouterLink],
})
export class AdminPage implements OnInit {
  private fb = inject(FormBuilder);
  auth = inject(AuthService);
  movies = inject(MovieService);
  users = signal<AppUser[]>([]);
  error = signal('');
  success = signal('');
  busy = signal(false);

  movieForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    year: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
    rating: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
    poster: [''],
    overview: [''],
  });

  async ngOnInit() {
    await Promise.all([this.movies.load(), this.refreshUsers()]);
  }

  get activeUsers() {
    return this.users().filter((user) => user.active).length;
  }

  async refreshUsers() {
    try {
      this.users.set(await this.auth.listUsers());
    } catch (e) {
      this.error.set(this.message(e));
    }
  }

  async addMovie() {
    this.error.set('');
    this.success.set('');
    if (this.movieForm.invalid) {
      this.movieForm.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    try {
      const value = this.movieForm.getRawValue();
      await this.movies.addMovie({
        title: value.title.trim(),
        year: value.year,
        rating: value.rating,
        poster: value.poster.trim() || null,
        overview: value.overview.trim(),
      });
      this.movieForm.reset({ title: '', year: '', rating: 0, poster: '', overview: '' });
      this.success.set('Film ajouté à la base.');
    } catch (e) {
      this.error.set(this.message(e));
    } finally {
      this.busy.set(false);
    }
  }

  async deactivate(user: AppUser) {
    this.error.set('');
    this.success.set('');
    try {
      await this.auth.deactivateUser(user.id);
      this.users.update((users) =>
        users.map((item) => item.id === user.id ? { ...item, active: false } : item)
      );
      this.success.set(`${user.firstName} ${user.lastName} a été désactivé.`);
    } catch (e) {
      this.error.set(this.message(e));
    }
  }

  async activate(user: AppUser) {
    this.error.set('');
    this.success.set('');
    try {
      await this.auth.activateUser(user.id);
      this.users.update((users) =>
        users.map((item) => item.id === user.id ? { ...item, active: true } : item)
      );
      this.success.set(`${user.firstName} ${user.lastName} a été réactivé.`);
    } catch (e) {
      this.error.set(this.message(e));
    }
  }

  private message(error: unknown) {
    return error instanceof Error ? error.message : 'Une erreur est survenue.';
  }
}
