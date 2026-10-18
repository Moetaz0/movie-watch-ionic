import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, NavController } from '@ionic/angular';
import { doc, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth as fbAuth, db } from '../../firebase';
import { AuthService } from '../../services/auth.service';
import { PhotoService } from '../../services/photo.service';
import { BgShadowsComponent } from '../../components/bg-shadows/bg-shadows.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

type Field = 'firstName' | 'lastName' | 'age';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  templateUrl: './edit-profile.page.html',
  imports: [IonContent, ReactiveFormsModule, BgShadowsComponent, PageHeaderComponent],
})
export class EditProfilePage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private photoService = inject(PhotoService);
  private nav = inject(NavController);

  email = this.authService.currentUser()?.email ?? '';
  photo = signal<string | null>(this.authService.currentUser()?.photo ?? null);
  error = signal('');
  busy = signal(false);
  resetMsg = signal('');
  resetBusy = signal(false);

  form = this.fb.nonNullable.group({
    firstName: [this.authService.currentUser()?.firstName ?? '', Validators.required],
    lastName: [this.authService.currentUser()?.lastName ?? '', Validators.required],
    age: [
      this.authService.currentUser()?.age ?? 18,
      [Validators.required, Validators.min(10), Validators.max(120)],
    ],
  });

  invalid(name: Field) {
    const c = this.form.controls[name];
    return c.invalid && c.touched;
  }

  async changePhoto() {
    const p = await this.photoService.pick();
    if (p) this.photo.set(p);
  }

  async save() {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const user = this.authService.currentUser();
    if (!user) return;

    this.busy.set(true);
    try {
      const changes = { ...this.form.getRawValue(), photo: this.photo() };
      await updateDoc(doc(db, 'users', user.id), changes);
      this.authService.patchLocal(changes);
      this.nav.navigateBack('/profile');
    } catch {
      this.error.set("Impossible d'enregistrer les modifications.");
    } finally {
      this.busy.set(false);
    }
  }

  async sendReset() {
    if (!this.email) return;
    this.resetBusy.set(true);
    this.resetMsg.set('');
    try {
      await sendPasswordResetEmail(fbAuth, this.email);
      this.resetMsg.set(`Email envoyé à ${this.email}. Pensez à vérifier vos spams.`);
    } catch (e: any) {
      this.resetMsg.set(
        e?.code === 'auth/too-many-requests'
          ? 'Trop de tentatives. Réessayez plus tard.'
          : "Impossible d'envoyer l'email."
      );
    } finally {
      this.resetBusy.set(false);
    }
  }
}