import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink],
 host: { class: 'absolute inset-x-0 bottom-0 z-10 block bg-[var(--bg)]' },
  template: `
    <nav class="grid grid-cols-4 pb-[env(safe-area-inset-bottom)] text-[11px] font-black uppercase tracking-widest">
      @for (t of tabs; track t.label) {
        @if (t.link) {
          <a
            [routerLink]="t.link"
            class="border-t-4 py-4 text-center"
            [class]="t.link === active() ? 'border-[var(--accent)]' : 'border-[var(--fg)] opacity-40'"
          >
            {{ t.label }}
          </a>
        } @else {
          <span class="border-t-4 border-[var(--fg)] py-4 text-center opacity-40">{{ t.label }}</span>
        }
      }
    </nav>
  `,
})
export class BottomNavComponent {
  active = input('/home');

  // link: null = page not built yet
  tabs = [
    { label: 'Films', link: '/home' },
    { label: 'Favoris', link: null as string | null },
    { label: 'Match', link: null as string | null },
    { label: 'Profil', link: '/profile' },
  ];
}