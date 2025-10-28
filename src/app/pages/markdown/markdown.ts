import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MarkdownTabComponent } from '../home/markdown/markdown';

@Component({
  selector: 'app-markdown-page',
  imports: [CommonModule, MarkdownTabComponent],
  templateUrl: './markdown.html',
  styleUrl: './markdown.scss'
})
export class MarkdownPageComponent { }
