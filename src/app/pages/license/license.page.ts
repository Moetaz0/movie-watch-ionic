import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { BgShadowsComponent } from '../../components/bg-shadows/bg-shadows.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

@Component({
  selector: 'app-license',
  imports: [IonContent, BgShadowsComponent, PageHeaderComponent],
  template: `
    <ion-content [fullscreen]="true" class="[--background:var(--bg)]">
      <div class="relative min-h-full bg-[var(--bg)] px-6 pb-16 pt-[max(2.5rem,env(safe-area-inset-top))] font-sans text-[var(--fg)]">
        <app-bg-shadows />
        <app-page-header title="Licence" />

        <h2 class="relative mt-10 border-t-2 border-[var(--fg)] pt-2 text-[11px] font-black uppercase tracking-[0.2em]">
          Movie Match · Licence MIT
        </h2>
        <p class="relative mt-3 text-sm font-bold">{{ copyright }}</p>
        <p class="relative mt-3 text-xs leading-relaxed whitespace-pre-line">{{ mit }}</p>

        <h2 class="relative mt-10 border-t-2 border-[var(--fg)] pt-2 text-[11px] font-black uppercase tracking-[0.2em]">
          Bibliothèques tierces
        </h2>
        <ul class="relative mt-2">
          @for (l of libs; track l.name) {
            <li class="flex items-baseline justify-between border-b border-[var(--fg)]/30 py-3">
              <span class="text-base font-black uppercase tracking-tight">{{ l.name }}</span>
              <span class="text-[11px] font-bold uppercase tracking-widest opacity-60">{{ l.license }}</span>
            </li>
          }
        </ul>

        <h2 class="relative mt-10 border-t-2 border-[var(--fg)] pt-2 text-[11px] font-black uppercase tracking-[0.2em]">
          Données des films
        </h2>
        <p class="relative mt-3 text-sm font-medium leading-relaxed">
          Ce produit utilise l’API TMDB mais n’est ni approuvé ni certifié par TMDB. Les affiches et
          informations de films appartiennent à leurs ayants droit respectifs.
        </p>
      </div>
    </ion-content>
  `,
})
export class LicensePage {
  copyright = 'Copyright (c) 2026 Équipe Movie Match'; // mettez vos noms

  mit = `Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`;

  libs = [
    { name: 'Ionic Framework', license: 'MIT' },
    { name: 'Angular', license: 'MIT' },
    { name: 'Capacitor', license: 'MIT' },
    { name: 'Ionicons', license: 'MIT' },
    { name: 'Tailwind CSS', license: 'MIT' },
    { name: 'Firebase JS SDK', license: 'Apache 2.0' },
  ];
}