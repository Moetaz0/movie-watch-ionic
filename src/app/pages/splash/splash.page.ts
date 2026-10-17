import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { BgShadowsComponent } from '../../components/bg-shadows/bg-shadows.component';

const DURATION_MS = 3000;
const STEP_MS = 30;

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  imports: [IonContent, BgShadowsComponent],
})
export class SplashPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private auth = inject(AuthService);

  progress = signal(0);
  private timer?: ReturnType<typeof setInterval>;

  ngOnInit() {
    const start = Date.now();

    this.timer = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / DURATION_MS) * 100);
      this.progress.set(Math.round(pct));

      if (pct >= 100) {
        clearInterval(this.timer);
        this.leave();
      }
    }, STEP_MS);
  }

  private async leave() {
    await this.auth.ready; // attend Firebase si ce n'est pas déjà fait
    this.router.navigateByUrl(this.auth.currentUser() ? '/home' : '/login', {
      replaceUrl: true,
    });
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}