import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbNavChangeEvent, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { JsonTabComponent } from './json/json';
import { DateTabComponent } from './date/date';
import { RestTabComponent } from './rest/rest';
import { EncoderTabComponent } from './encoder/encoder';
import { HashTabComponent } from "./hash/hash";
import { StringDiffTabComponent } from "./string-diff/string-diff";
import { MarkdownTabComponent } from './markdown/markdown';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    NgbNavModule,
    JsonTabComponent,
    DateTabComponent,
    RestTabComponent,
    EncoderTabComponent,
    HashTabComponent,
    StringDiffTabComponent,
    MarkdownTabComponent
],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  active: string = 'json';
  currentYear = new Date().getFullYear();
  activateTab: string = 'json';

  links = [
    { title: 'JSON', fragment: 'json', component: () => import('./json/json').then(m => m.JsonTabComponent) },
    // { title: 'Date Time', fragment: 'date', component: () => import('./date/date').then(m => m.DateTabComponent) },
    { title: 'Encoder', fragment: 'encoder', component: () => import('./encoder/encoder').then(m => m.EncoderTabComponent) },
    { title: 'REST', fragment: 'rest', component: () => import('./rest/rest').then(m => m.RestTabComponent) },
    { title: 'Hash', fragment: 'hash', component: () => import('./hash/hash').then(m => m.HashTabComponent) },
    { title: 'String Diff', fragment: 'string-diff', component: () => import('./string-diff/string-diff').then(m => m.StringDiffTabComponent) },
    { title: 'Markdown', fragment: 'markdown', component: () => import('./markdown/markdown').then(m => m.MarkdownTabComponent) }
  ];

  onTabChange(event: NgbNavChangeEvent) {
    this.activateTab = event.nextId;
    // if (event.activeId === 'json' && this.hasUnsavedChanges()) {
    //   if (!confirm('You have unsaved changes. Do you want to leave?')) {
    //     event.preventDefault();
    //   }
    // }
  }

  // private hasUnsavedChanges(): boolean {
  //   const jsonComponent = (window as any).jsonComponent;
  //   return jsonComponent?.rawJson ? true : false;
  // }
  
}