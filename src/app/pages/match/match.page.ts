import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { MATCH_THRESHOLD, MatchService } from '../../services/match.service';
import { MovieService } from '../../services/movie.service';
import { FavoritesService } from '../../services/favorites.service';
import { BgShadowsComponent } from '../../components/bg-shadows/bg-shadows.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-match',
  imports: [IonContent, RouterLink, BgShadowsComponent, BottomNavComponent],
  templateUrl: './match.page.html',
})
export class MatchPage implements OnInit {
  matchService = inject(MatchService);
  movieService = inject(MovieService);
  favorites = inject(FavoritesService);

  threshold = MATCH_THRESHOLD;

  ngOnInit() {
    this.movieService.load();
    this.matchService.compute();
  }

  title(id: number) {
    return this.movieService.movies().find((m) => m.id === id)?.title ?? `Film ${id}`;
  }

  rounded(rate: number) {
    return Math.round(rate);
  }

  pad(n: number) {
    return n.toString().padStart(2, '0');
  }
}