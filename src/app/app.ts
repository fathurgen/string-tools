import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('stringtools');
  protected readonly isDarkMode = computed(() => this.themeService.theme() === 'dark');
  protected readonly currentYear = new Date().getFullYear();

  private readonly themeService = inject(ThemeService);

  constructor() {
    console.log(environment.envName);
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
