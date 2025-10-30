import { CommonModule } from '@angular/common';
import { Component, SecurityContext } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MarkdownService } from '../../../services/markdown.service';

@Component({
  selector: 'app-markdown',
  imports: [CommonModule, FormsModule],
  templateUrl: './markdown.html',
  styleUrl: './markdown.scss'
})
export class MarkdownTabComponent {
  markdownText = '';
  renderedHtml = '';
  copyState: 'idle' | 'success' | 'error' | 'unsupported' = 'idle';

  constructor(
    private readonly markdownService: MarkdownService,
    private readonly domSanitizer: DomSanitizer
  ) {
    this.renderPreview();
  }

  onInput(value: string): void {
    this.markdownText = value;
    this.renderPreview();
    this.copyState = 'idle';
  }

  clear(): void {
    this.markdownText = '';
    this.renderPreview();
    this.copyState = 'idle';
  }

  async copyPreview(): Promise<void> {
    const html = this.renderedHtml;
    if (!html.trim()) {
      this.copyState = 'error';
      return;
    }

    const clipboard = navigator.clipboard;
    if (!clipboard || !clipboard.writeText) {
      this.copyState = 'unsupported';
      return;
    }

    try {
      await clipboard.writeText(html);
      this.copyState = 'success';
    } catch (error) {
      console.error('Failed to copy markdown HTML', error);
      this.copyState = 'error';
    }
  }

  private renderPreview(): void {
    const parsedHtml = this.markdownService.parse(this.markdownText);
    this.renderedHtml = this.domSanitizer.sanitize(SecurityContext.HTML, parsedHtml) ?? '';
  }
}
