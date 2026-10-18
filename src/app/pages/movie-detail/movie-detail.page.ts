import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { MovieService } from '../../services/movie.service';
import { FavoritesService } from '../../services/favorites.service';
import { BgShadowsComponent } from '../../components/bg-shadows/bg-shadows.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  templateUrl: './movie-detail.page.html',
  imports: [IonContent, BgShadowsComponent, PageHeaderComponent],
})
export class MovieDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  movieService = inject(MovieService);
  favorites = inject(FavoritesService);

  id = Number(this.route.snapshot.paramMap.get('id'));
  movie = computed(() => this.movieService.movies().find((m) => m.id === this.id) ?? null);
  fans = signal<number | null>(null);

  async ngOnInit() {
    await this.movieService.load();
    this.loadFans();
  }

  async toggle() {
    await this.favorites.toggle(this.id);
    this.loadFans();
  }

  private async loadFans() {
    try {
      const q = query(collection(db, 'users'), where('favoriteMovieIds', 'array-contains', this.id));
      const snap = await getDocs(q);
      this.fans.set(snap.docs.filter((d) => d.data()['active'] !== false).length);
    } catch {
      this.fans.set(null);
    }
  }
}