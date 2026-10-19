import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  private theme = inject(ThemeService);

  constructor() {
    this.theme.init();
  }
}
