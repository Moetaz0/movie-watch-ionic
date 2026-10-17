import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  chevronForwardSharp,
  documentTextSharp,
  informationCircleSharp,
  logOutSharp,
  mailSharp,
  moonSharp,
  shieldCheckmarkSharp,
  sunnySharp,
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { BgShadowsComponent } from '../../components/bg-shadows/bg-shadows.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-profile',
  imports: [IonContent, IonIcon, RouterLink, BgShadowsComponent, BottomNavComponent],
  template: `
    <ion-content [fullscreen]="true" class="[--background:var(--bg)]">
      <div class="relative min-h-full bg-[var(--bg)] px-6 pb-32 pt-[max(2.5rem,env(safe-area-inset-top))] font-sans text-[var(--fg)]">
        <app-bg-shadows />

        <header class="relative flex justify-between border-t-[6px] border-[var(--fg)] pt-2 text-[11px] font-bold uppercase tracking-[0.2em]">
          <span>Movie Match</span>
          <span>Profil</span>
        </header>

        <h1 class="relative mt-6 text-[4rem] font-black uppercase leading-[0.8] tracking-tighter">
          Profil<span class="text-[var(--accent)]">.</span>
        </h1>

        <!-- Identity card -->
        @if (auth.currentUser(); as u) {
          <section class="relative mt-8 flex items-end gap-4">
            <div class="relative size-28 shrink-0 overflow-hidden border-4 border-[var(--fg)] bg-[var(--fg)]/10">
              @if (u.photo) {
                <img [src]="u.photo" alt="Ma photo" class="size-full object-cover" />
              } @else {
                <div class="absolute -right-4 bottom-3 size-14 rounded-full bg-[var(--accent)]"></div>
                <div class="absolute bottom-0 left-0 size-7 bg-[var(--fg)]"></div>
              }
            </div>
            <div class="min-w-0">
              <h2 class="text-2xl font-black uppercase leading-[0.9] tracking-tight">
                {{ u.firstName }}<br />{{ u.lastName }}
              </h2>
              <p class="mt-2 truncate text-[11px] font-bold tracking-widest">{{ u.email }}</p>
              <p class="mt-1 text-[11px] font-bold uppercase tracking-widest">
                {{ u.age }} ans ·
                <span class="text-[var(--accent)]">{{ u.role === 'admin' ? 'Admin' : 'Membre' }}</span>
                · {{ u.favoriteMovieIds.length }} favoris
              </p>
            </div>
          </section>
        }

        <!-- 01 Preferences -->
        <h3 class="relative mt-12 text-[11px] font-black uppercase tracking-[0.2em]">01 — Préférences</h3>
        <section class="relative mt-2 border-b-2 border-[var(--fg)]">
          <button
            type="button"
            (click)="theme.toggle()"
            class="flex w-full items-center justify-between border-t-2 border-[var(--fg)] py-4 text-left"
          >
            <span>
              <span class="block text-lg font-black uppercase tracking-tight">Thème</span>
              <span class="block text-[11px] font-bold uppercase tracking-widest opacity-60">
                {{ theme.dark() ? 'Sombre · noir et rouge' : 'Clair · blanc et rouge' }}
              </span>
            </span>
            <ion-icon [name]="theme.dark() ? 'sunny-sharp' : 'moon-sharp'" class="text-3xl text-[var(--accent)]"></ion-icon>
          </button>
        </section>

        <!-- 02 Information -->
        <h3 class="relative mt-10 text-[11px] font-black uppercase tracking-[0.2em]">02 — Informations</h3>
        <section class="relative mt-2 border-b-2 border-[var(--fg)]">
          @for (r of rows; track r.link) {
            <a [routerLink]="r.link" class="flex items-center justify-between border-t-2 border-[var(--fg)] py-4">
              <span class="flex items-center gap-4">
                <ion-icon [name]="r.icon" class="text-2xl"></ion-icon>
                <span class="text-lg font-black uppercase tracking-tight">{{ r.label }}</span>
              </span>
              <ion-icon name="chevron-forward-sharp" class="text-xl"></ion-icon>
            </a>
          }
          <a [href]="'mailto:' + contactEmail" class="flex items-center justify-between border-t-2 border-[var(--fg)] py-4">
            <span class="flex items-center gap-4">
              <ion-icon name="mail-sharp" class="text-2xl"></ion-icon>
              <span class="text-lg font-black uppercase tracking-tight">Contact</span>
            </span>
            <ion-icon name="chevron-forward-sharp" class="text-xl"></ion-icon>
          </a>
        </section>

        <!-- Logout -->
        <button
          type="button"
          (click)="logout()"
          class="relative mt-10 flex w-full items-center justify-center gap-3 bg-[var(--accent)] py-4 text-sm font-black uppercase tracking-[0.2em] text-white"
        >
          <ion-icon name="log-out-sharp" class="text-2xl"></ion-icon>
          Se déconnecter
        </button>

        <p class="relative mt-8 text-center text-[11px] font-bold uppercase tracking-widest opacity-50">
          Movie Match · v1.0.0
        </p>
      </div>
<app-bottom-nav slot="fixed" active="/profile" />
    </ion-content>
  `,
})
export class ProfilePage {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  private router = inject(Router);

  contactEmail = 'contact@moviematch.tn'; // à remplacer par votre email

  rows = [
    { label: 'À propos', icon: 'information-circle-sharp', link: '/about' },
    { label: 'Licence', icon: 'document-text-sharp', link: '/license' },
    { label: 'Confidentialité', icon: 'shield-checkmark-sharp', link: '/privacy' },
  ];

  constructor() {
    addIcons({
      chevronForwardSharp,
      documentTextSharp,
      informationCircleSharp,
      logOutSharp,
      mailSharp,
      moonSharp,
      shieldCheckmarkSharp,
      sunnySharp,
    });
  }

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}