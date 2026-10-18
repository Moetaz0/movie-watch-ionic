import { Component, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { PagerComponent } from '../components/pager/pager.component';
import { IonContent } from '@ionic/angular';
import { MovieService } from '../services/movie.service';
import { FavoritesService } from '../services/favorites.service';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { BgShadowsComponent } from '../components/bg-shadows/bg-shadows.component';
import { BottomNavComponent } from '../components/bottom-nav/bottom-nav.component';
import { NavController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  imports: [IonContent, BgShadowsComponent , BottomNavComponent , RouterLink , PagerComponent],
})
export class HomePage implements OnInit {
  movieService = inject(MovieService);
  favorites = inject(FavoritesService);
  theme = inject(ThemeService);
  auth = inject(AuthService);
  private nav = inject(NavController);

  query = signal('');

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.movieService.movies().filter((m) => m.title.toLowerCase().includes(q));
  });
readonly pageSize = 12; // change this to show more or fewer per page

page = signal(1);
content = viewChild(IonContent);

totalPages = computed(() =>
  Math.max(1, Math.ceil(this.filtered().length / this.pageSize))
);

// protects against a stale page number when the list shrinks
currentPage = computed(() => Math.min(this.page(), this.totalPages()));

offset = computed(() => (this.currentPage() - 1) * this.pageSize);

paged = computed(() =>
  this.filtered().slice(this.offset(), this.offset() + this.pageSize)
);

onSearch(value: string) {
  this.query.set(value);
  this.page.set(1);
}

goTo(n: number) {
  this.page.set(n);
  this.content()?.scrollToTop(300);
}
  ngOnInit() {
    this.movieService.load();
  }

  pad(n: number) {
    return n.toString().padStart(2, '0');
  }

  async logout() {
    await this.auth.logout();
    this.nav.navigateRoot('/login', { replaceUrl: true });
  }
}