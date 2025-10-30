import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    NgbCollapseModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderLayout {
  isCollapsed = true;
  protected readonly isDarkMode = computed(() => this.themeService.theme() === 'dark');

  private readonly themeService = inject(ThemeService);
  
  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
