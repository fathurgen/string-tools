import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'string-tools-theme';
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  private transitionCleanupTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly themeSignal = signal<Theme>(this.getInitialTheme());
  readonly theme = this.themeSignal.asReadonly();

  constructor() {
    this.applyTheme(this.themeSignal());
  }

  toggleTheme(): void {
    const nextTheme: Theme = this.themeSignal() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  setTheme(theme: Theme): void {
    if (this.themeSignal() === theme) {
      return;
    }

    this.themeSignal.set(theme);
    this.applyTheme(theme);
    this.persistTheme(theme);
  }

  private getInitialTheme(): Theme {
    if (!this.isBrowser) {
      return 'light';
    }

    const storedTheme = window.localStorage.getItem(this.storageKey) as Theme | null;
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    const prefersDark = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    const body = this.document?.body;
    if (!body) {
      return;
    }

    if (this.isBrowser) {
      body.classList.add('theme-transition');

      if (this.transitionCleanupTimer !== null) {
        window.clearTimeout(this.transitionCleanupTimer);
      }

      this.transitionCleanupTimer = window.setTimeout(() => {
        body.classList.remove('theme-transition');
      }, 400);
    }

    body.classList.toggle('dark-mode', theme === 'dark');
    body.setAttribute('data-bs-theme', theme);
  }

  private persistTheme(theme: Theme): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      window.localStorage.setItem(this.storageKey, theme);
    } catch (error) {
      console.warn('Failed to persist theme preference', error);
    }
  }
}
