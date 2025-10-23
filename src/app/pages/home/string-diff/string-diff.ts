import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import DiffMatchPatch from 'diff-match-patch';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Component({
  selector: 'app-string-diff',
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './string-diff.html',
  styleUrl: './string-diff.scss'
})
export class StringDiffTabComponent {
  private analytics = inject(Analytics);
  originalText = '';
  modifiedText = '';
  diffLeft: SafeHtml | null = null;
  diffRight: SafeHtml | null = null;
  showDiff = false;

  // opsi tambahan
  ignoreWhitespace = false;
  lineByLine = false;

  constructor(private sanitizer: DomSanitizer) {}

  compare() {
    logEvent(this.analytics, 'operation_tool', { item_name: 'string-diff', tool: 'compare', action: this.lineByLine ? 'line-by-line' : 'inline' });
    const dmp = new DiffMatchPatch();

    let left = this.originalText;
    let right = this.modifiedText;

    if (this.ignoreWhitespace) {
      left = left.replace(/\s+/g, ' ').trim();
      right = right.replace(/\s+/g, ' ').trim();
    }

    const diffs = dmp.diff_main(left, right);
    dmp.diff_cleanupSemantic(diffs);

    if (this.lineByLine) {
      this.renderLineByLine(diffs);
    } else {
      this.renderInline(diffs);
    }
  }

  private renderInline(diffs: [number, string][]) {
    let leftHtml = '';
    let rightHtml = '';

    for (const [type, text] of diffs) {
      const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');

      if (type === -1) {
        leftHtml += `<span class="diff-del">${escaped}</span>`;
        rightHtml += `<span class="diff-empty"></span>`;
      } else if (type === 1) {
        leftHtml += `<span class="diff-empty"></span>`;
        rightHtml += `<span class="diff-add">${escaped}</span>`;
      } else {
        leftHtml += `<span class="diff-same">${escaped}</span>`;
        rightHtml += `<span class="diff-same">${escaped}</span>`;
      }
    }

    this.diffLeft = this.sanitizer.bypassSecurityTrustHtml(leftHtml);
    this.diffRight = this.sanitizer.bypassSecurityTrustHtml(rightHtml);
    this.showDiff = true;
  }

  private renderLineByLine(diffs: [number, string][]) {
    const leftLines: string[] = [];
    const rightLines: string[] = [];

    for (const [type, text] of diffs) {
      const lines = text.split('\n');
      for (const line of lines) {
        if (line === '') continue;
        const escaped = line
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        if (type === -1) {
          leftLines.push(`<div class="diff-line diff-del">- ${escaped}</div>`);
          rightLines.push(`<div class="diff-line diff-empty"></div>`);
        } else if (type === 1) {
          leftLines.push(`<div class="diff-line diff-empty"></div>`);
          rightLines.push(`<div class="diff-line diff-add">+ ${escaped}</div>`);
        } else {
          leftLines.push(`<div class="diff-line diff-same">${escaped}</div>`);
          rightLines.push(`<div class="diff-line diff-same">${escaped}</div>`);
        }
      }
    }

    this.diffLeft = this.sanitizer.bypassSecurityTrustHtml(leftLines.join(''));
    this.diffRight = this.sanitizer.bypassSecurityTrustHtml(rightLines.join(''));
    this.showDiff = true;
  }

  clear() {
    this.originalText = '';
    this.modifiedText = '';
    this.diffLeft = null;
    this.diffRight = null;
    this.showDiff = false;
  }
}
