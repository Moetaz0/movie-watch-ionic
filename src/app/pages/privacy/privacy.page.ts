import { Component , inject } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { BgShadowsComponent } from '../../components/bg-shadows/bg-shadows.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

@Component({
  selector: 'app-privacy',
  imports: [IonContent, BgShadowsComponent, PageHeaderComponent],
  templateUrl: './privacy.page.html',
})
export class PrivacyPage {
  sections = [
    {
      title: 'Données collectées',
      text: 'Nom, prénom, âge, adresse email, photo de profil et liste de films favoris. Le mot de passe est géré par Firebase Authentication et n’est jamais visible par l’application ni par les administrateurs.',
    },
    {
      title: 'Utilisation',
      text: 'Ces données servent uniquement au fonctionnement de l’application : connexion, profil, playlist et fonction de matching.',
    },
    {
      title: 'Matching',
      text: 'La fonction de matching permet aux autres utilisateurs de voir votre prénom, votre photo et le taux de correspondance de vos favoris avec les leurs. Vos autres informations ne sont pas affichées.',
    },
    {
      title: 'Stockage',
      text: 'Les données sont hébergées sur Firebase (Google). La photo est enregistrée dans votre profil sous forme d’image réduite.',
    },
    {
      title: 'Compte désactivé',
      text: 'Un administrateur peut désactiver un compte. Le compte n’est pas supprimé, mais la connexion devient impossible.',
    },
    {
      title: 'Vos droits',
      text: 'Vous pouvez demander la consultation, la modification ou la suppression de vos données en nous contactant depuis la page Profil.',
    },
  ];

  pad(n: number) {
    return n.toString().padStart(2, '0');
  }
}