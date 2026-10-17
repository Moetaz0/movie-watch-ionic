import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { MovieService } from '../services/movie.service';
import { FavoritesService } from '../services/favorites.service';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { BgShadowsComponent } from '../components/bg-shadows/bg-shadows.component';
import { BottomNavComponent } from '../components/bottom-nav/bottom-nav.component';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  imports: [IonContent, BgShadowsComponent , BottomNavComponent],
})
export class HomePage implements OnInit {
  movieService = inject(MovieService);
  favorites = inject(FavoritesService);
  theme = inject(ThemeService);
  auth = inject(AuthService);
  private router = inject(Router);

  query = signal('');

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.movieService.movies().filter((m) => m.title.toLowerCase().includes(q));
  });

  ngOnInit() {
    this.movieService.load();
  }

  pad(n: number) {
    return n.toString().padStart(2, '0');
  }

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}