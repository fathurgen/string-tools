import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AboutComponent } from './pages/about/about';
import { PrivacyComponent } from './pages/privacy/privacy';
import { BlogComponent } from './pages/blog/blog';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  { path: 'about', component: AboutComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:slug', component: BlogComponent }, // gunakan komponen yang sama
  // { path: 'contact', component: ContactComponent },
];