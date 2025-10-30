import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { HeaderLayout } from './layouts/header/header';
import { FooterLayout } from './layouts/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HeaderLayout, FooterLayout],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('stringtools');
  protected readonly currentYear = new Date().getFullYear();

  constructor() {
    console.log(environment.envName);
  }

}
