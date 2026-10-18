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
  createSharp
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { BgShadowsComponent } from '../../components/bg-shadows/bg-shadows.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-profile',
  imports: [IonContent, IonIcon, RouterLink, BgShadowsComponent, BottomNavComponent],
  templateUrl: './profile.page.html',
})
export class ProfilePage {
  private nav = inject(NavController);
  auth = inject(AuthService);
  theme = inject(ThemeService);
  private router = inject(Router);

  contactEmail = 'contact@moviematch.tn'; 

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
      createSharp
    });
  }

  async logout() {
    await this.auth.logout();
    this.nav.navigateRoot('/login', { replaceUrl: true });
  }
}