import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { BgShadowsComponent } from '../../components/bg-shadows/bg-shadows.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

@Component({
  selector: 'app-about',
  imports: [IonContent, BgShadowsComponent, PageHeaderComponent],
  template: `
    <ion-content [fullscreen]="true" class="[--background:var(--bg)]">
      <div class="relative min-h-full bg-[var(--bg)] px-6 pb-16 pt-[max(2.5rem,env(safe-area-inset-top))] font-sans text-[var(--fg)]">
        <app-bg-shadows />
        <app-page-header title="À propos" />

        <p class="relative mt-8 text-base font-medium leading-relaxed">
          Movie Match est une application mobile de gestion de films. Chaque utilisateur compose sa playlist
          de films préférés, puis découvre les personnes qui ont des goûts proches des siens.
        </p>

        <h2 class="relative mt-10 border-t-2 border-[var(--fg)] pt-2 text-[11px] font-black uppercase tracking-[0.2em]">
          Fonctionnalités
        </h2>
        <ul class="relative mt-2">
          @for (f of features; track f; let i = $index) {
            <li class="flex gap-4 border-b border-[var(--fg)]/30 py-3">
              <span class="text-[11px] font-black tabular-nums text-[var(--accent)]">{{ pad(i + 1) }}</span>
              <span class="text-sm font-bold">{{ f }}</span>
            </li>
          }
        </ul>

        <h2 class="relative mt-10 border-t-2 border-[var(--fg)] pt-2 text-[11px] font-black uppercase tracking-[0.2em]">
          Équipe
        </h2>
        <ul class="relative mt-2">
          @for (m of team; track m.name) {
            <li class="flex items-baseline justify-between border-b border-[var(--fg)]/30 py-3">
              <span class="text-lg font-black uppercase tracking-tight">{{ m.name }}</span>
              <span class="text-[11px] font-bold uppercase tracking-widest opacity-60">{{ m.role }}</span>
            </li>
          }
        </ul>

        <h2 class="relative mt-10 border-t-2 border-[var(--fg)] pt-2 text-[11px] font-black uppercase tracking-[0.2em]">
          Technologies
        </h2>
        <div class="relative mt-3 flex flex-wrap gap-2">
          @for (t of stack; track t) {
            <span class="border-2 border-[var(--fg)] px-3 py-1 text-[11px] font-black uppercase tracking-widest">{{ t }}</span>
          }
        </div>

        <h2 class="relative mt-10 border-t-2 border-[var(--fg)] pt-2 text-[11px] font-black uppercase tracking-[0.2em]">
          Contexte
        </h2>
        <p class="relative mt-2 text-sm font-medium leading-relaxed">
          Mini-projet Ionic réalisé à la FSEGT, Université de Tunis El Manar, en 2026.
        </p>
      </div>
    </ion-content>
  `,
})
export class AboutPage {
  features = [
    'Inscription avec photo prise à la caméra',
    'Playlist personnelle de films favoris',
    'Matching : utilisateurs dont les favoris correspondent à plus de 75 %',
    'Espace administrateur : ajout de films, désactivation d’utilisateurs',
    'Thème clair (blanc et rouge) et sombre (noir et rouge)',
  ];

  // à remplacer par les vrais membres du groupe (4 maximum)
  team = [
    { name: 'Prénom Nom', role: 'Développement' },
    { name: 'Prénom Nom', role: 'Design' },
    { name: 'Prénom Nom', role: 'Base de données' },
    { name: 'Prénom Nom', role: 'Tests' },
  ];

  stack = ['Ionic', 'Angular', 'Capacitor', 'Firebase', 'Tailwind CSS', 'TMDB'];

  pad(n: number) {
    return n.toString().padStart(2, '0');
  }
}