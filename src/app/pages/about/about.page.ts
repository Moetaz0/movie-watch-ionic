import { Component , inject } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { BgShadowsComponent } from '../../components/bg-shadows/bg-shadows.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-about',
  imports: [IonContent, BgShadowsComponent, PageHeaderComponent],
  templateUrl: './about.page.html',
})
export class AboutPage {
  private nav = inject(NavController);
  features = [
    'Inscription avec photo prise à la caméra',
    'Playlist personnelle de films favoris',
    'Matching : utilisateurs dont les favoris correspondent à plus de 75 %',
    'Espace administrateur : ajout de films, désactivation d’utilisateurs',
    'Thème clair (blanc et rouge) et sombre (noir et rouge)',
  ];

  // à remplacer par les vrais membres du groupe (4 maximum)
  team = [
    { name: 'Moetaz Abdallah', role: 'Développement' },
    { name: 'Moetaz Abdallah', role: 'Design' },
    { name: 'Souhail Milliani', role: 'Base de données' },
    { name: 'Souhail Milliani', role: 'Tests' },
  ];

  stack = ['Ionic', 'Angular', 'Capacitor', 'Firebase', 'Tailwind CSS', 'TMDB'];

  pad(n: number) {
    return n.toString().padStart(2, '0');
  }
}