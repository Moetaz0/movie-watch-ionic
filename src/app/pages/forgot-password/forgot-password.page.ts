import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { BgShadowsComponent } from '../../components/bg-shadows/bg-shadows.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.page.html',
  imports: [IonContent, ReactiveFormsModule, RouterLink, BgShadowsComponent],
})
export class ForgotPasswordPage {
  email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  busy = signal(false);
  sent = signal(false);
  error = signal('');

  async submit() {
    this.error.set('');
    if (this.email.invalid) {
      this.email.markAsTouched();
      return;
    }
    this.busy.set(true);
    try {
      await sendPasswordResetEmail(auth, this.email.value.trim());
      this.sent.set(true);
    } catch (e: any) {
      switch (e?.code) {
        case 'auth/invalid-email':
          this.error.set('Email invalide.');
          break;
        case 'auth/too-many-requests':
          this.error.set('Trop de tentatives. Réessayez plus tard.');
          break;
        case 'auth/network-request-failed':
          this.error.set('Problème de connexion réseau.');
          break;
        default:
          this.error.set("Impossible d'envoyer l'email.");
      }
    } finally {
      this.busy.set(false);
    }
  }
}