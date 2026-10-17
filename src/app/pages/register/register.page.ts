import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from '../../services/auth.service';
import { Capacitor } from '@capacitor/core';
import { BgShadowsComponent } from '../../components/bg-shadows/bg-shadows.component';
type Field = 'firstName' | 'lastName' | 'age' | 'email' | 'password';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  imports: [IonContent, ReactiveFormsModule, RouterLink , BgShadowsComponent],
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  photo = signal<string | null>(null);
  photoMissing = signal(false);
  error = signal('');
  busy = signal(false);

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    age: [18, [Validators.required, Validators.min(10), Validators.max(120)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  invalid(name: Field) {
    const c = this.form.controls[name];
    return c.invalid && c.touched;
  }

 async takePhoto() {
  // Navigateur : sélecteur de fichier / webcam du système
  if (!Capacitor.isNativePlatform()) {
    document.getElementById('photoInput')?.click();
    return;
  }
  // Téléphone : vraie caméra
  try {
    const image = await Camera.getPhoto({
      quality: 60,
      width: 400,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    this.photo.set(image.dataUrl ?? null);
    this.photoMissing.set(false);
  } catch {
    // annulé
  }
}

onFileChosen(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => this.resize(reader.result as string);
  reader.readAsDataURL(file);
}

// Réduit la photo à 400 px pour rester bien sous la limite de 1 Mo de Firestore
private resize(dataUrl: string) {
  const img = new Image();
  img.onload = () => {
    const scale = Math.min(1, 400 / img.width);
    const canvas = document.createElement('canvas');
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
    this.photo.set(canvas.toDataURL('image/jpeg', 0.7));
    this.photoMissing.set(false);
  };
  img.src = dataUrl;
}

  async submit() {
    this.error.set('');
    this.photoMissing.set(!this.photo());
    if (this.form.invalid || !this.photo()) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    try {
      await this.auth.register({ ...this.form.getRawValue(), photo: this.photo() });
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (e: any) {
      this.error.set(e.message ?? "Erreur d'inscription.");
    } finally {
      this.busy.set(false);
    }
  }
}