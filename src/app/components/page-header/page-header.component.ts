import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackSharp } from 'ionicons/icons';

@Component({
  selector: 'app-page-header',
  imports: [IonIcon],
  template: `
    <header class="relative border-t-[6px] border-[var(--fg)] pt-2">
      <div class="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em]">
        <button type="button" (click)="back()" class="flex items-center gap-1 uppercase">
          <ion-icon name="arrow-back-sharp" class="text-base"></ion-icon>
          Retour
        </button>
        <span>Movie Match</span>
      </div>
      <h1 class="mt-8 text-[3rem] font-black uppercase leading-[0.85] tracking-tighter">
        {{ title() }}<span class="text-[var(--accent)]">.</span>
      </h1>
    </header>
  `,
})
export class PageHeaderComponent {
  title = input.required<string>();

  private location = inject(Location);
  private router = inject(Router);

  constructor() {
    addIcons({ arrowBackSharp });
  }

  back() {
    if (window.history.length > 1) this.location.back();
    else this.router.navigateByUrl('/profile');
  }
}