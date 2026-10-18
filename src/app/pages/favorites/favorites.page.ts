import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { MovieService } from '../../services/movie.service';
import { FavoritesService } from '../../services/favorites.service';
import { BgShadowsComponent } from '../../components/bg-shadows/bg-shadows.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-favorites',
  imports: [IonContent, RouterLink, BgShadowsComponent, BottomNavComponent],
  templateUrl: './favorites.page.html',
})
export class FavoritesPage implements OnInit {
  movieService = inject(MovieService);
  favorites = inject(FavoritesService);
private nav = inject(NavController);
  list = computed(() => {
    const ids = new Set(this.favorites.ids());
    return this.movieService.movies().filter((m) => ids.has(m.id));
  });

  ngOnInit() {
    this.movieService.load();
  }

  pad(n: number) {
    return n.toString().padStart(2, '0');
  }
}