import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-encoder',
  imports: [
    CommonModule,
    FormsModule,
    NgbNavModule,
    NgbDropdownModule
  ],
  templateUrl: './encoder.html',
  styleUrl: './encoder.scss'
})
export class EncoderTabComponent {
  private analytics = inject(Analytics);
  
  formattedEncodedText = '';
  copied = false;
  active = 1;
  
  inputText = '';
  selectedMethod = 'Base64';
  mode: 'encode' | 'decode' = 'encode';
  encodeDecodeMethods = ['Base64', 'URL', 'HTML Entity', 'Hex'];

  convert() {
    if (!this.inputText.trim()) {
      this.formattedEncodedText = '⚠️ Please enter some text';
      return;
    }

    try {
      logEvent(this.analytics, 'operation_tool', { item_name: 'encoder', tool: this.selectedMethod, action: this.mode });
      switch (this.selectedMethod) {
        case 'Base64':
          this.formattedEncodedText =
            this.mode === 'encode'
              ? btoa(unescape(encodeURIComponent(this.inputText)))
              : decodeURIComponent(escape(atob(this.inputText)));
          break;

        case 'URL':
          this.formattedEncodedText =
            this.mode === 'encode'
              ? encodeURIComponent(this.inputText)
              : decodeURIComponent(this.inputText);
          break;

        case 'HTML Entity':
          this.formattedEncodedText =
            this.mode === 'encode'
              ? this.encodeHtml(this.inputText)
              : this.decodeHtml(this.inputText);
          break;

        case 'Hex':
          this.formattedEncodedText =
            this.mode === 'encode'
              ? this.textToHex(this.inputText)
              : this.hexToText(this.inputText);
          break;

        default:
          this.formattedEncodedText = '❌ Unknown encoding method';
      }
    } catch (err) {
      this.formattedEncodedText = '❌ Invalid input for decoding';
    }
  }

  clear() {
    this.inputText = '';
    this.formattedEncodedText = '';
  }

  // helper functions
  private encodeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private decodeHtml(str: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  private textToHex(str: string): string {
    return Array.from(str)
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  }

  private hexToText(hex: string): string {
    const cleanHex = hex.replace(/[^0-9a-f]/gi, '');
    return cleanHex
      .match(/.{1,2}/g)!
      .map(byte => String.fromCharCode(parseInt(byte, 16)))
      .join('');
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.formattedEncodedText).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000); // hide after 2s
    });
  }

}
