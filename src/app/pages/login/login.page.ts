import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { BgShadowsComponent } from '../../components/bg-shadows/bg-shadows.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  imports: [IonContent, ReactiveFormsModule, RouterLink , BgShadowsComponent],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error = signal('');
  busy = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  invalid(name: 'email' | 'password') {
    const c = this.form.controls[name];
    return c.invalid && c.touched;
  }

  async submit() {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.login(email, password);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (e: any) {
      this.error.set(e.message ?? 'Erreur de connexion.');
    } finally {
      this.busy.set(false);
    }
  }
}