import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AboutComponent } from './pages/about/about';
import { PrivacyComponent } from './pages/privacy/privacy';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  { path: 'about', component: AboutComponent },
  { path: 'privacy', component: PrivacyComponent },
  // { path: 'contact', component: ContactComponent },
];