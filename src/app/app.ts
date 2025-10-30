import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { HeaderLayout } from './layouts/header/header';
import { FooterLayout } from './layouts/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderLayout, FooterLayout],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('stringtools');
  constructor() {
    console.log(environment.envName)
  }
}
