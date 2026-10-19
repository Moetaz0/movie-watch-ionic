import { Component, inject, input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  templateUrl: './bottom-nav.component.html',
  host: {
    class: 'fixed inset-x-0 bottom-0 z-50 block bg-[var(--bg)]',
  },
})
export class BottomNavComponent {
  active = input('/home');
  private nav = inject(NavController);

  tabs = [
    { label: 'Films', link: '/home' },
    { label: 'Favoris', link: '/favorites' },
    { label: 'Match', link: '/match' },
    { label: 'Profil', link: '/profile' },
  ];

  go(link: string) {
    if (link === this.active()) return;
    const from = this.tabs.findIndex((t) => t.link === this.active());
    const to = this.tabs.findIndex((t) => t.link === link);
    if (to > from) this.nav.navigateForward(link);
    else this.nav.navigateBack(link);
  }
}