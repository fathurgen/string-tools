import { Injectable } from '@angular/core';
import { marked } from 'marked';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  constructor() {
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }

  parse(markdown: string): string {
    if (!markdown || !markdown.trim()) {
      return '';
    }

    try {
      const parsed = marked.parse(markdown, { async: false });
      return typeof parsed === 'string' ? parsed : String(parsed ?? '');
    } catch (error) {
      console.error('Failed to parse markdown', error);
      return '<p class="text-danger">❌ Unable to render markdown preview.</p>';
    }
  }
}
