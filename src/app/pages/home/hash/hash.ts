import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import * as bcrypt from 'bcryptjs';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Component({
  selector: 'app-hash',
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule
  ],
  templateUrl: './hash.html',
  styleUrl: './hash.scss'
})
export class HashTabComponent {
  private analytics = inject(Analytics);
  inputText = '';
  hashResult = '';
  selectedMethod = 'MD5';

  hashMethods = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512', 'bcrypt'];
  copied = false;

  async generateHash() {
    if (!this.inputText.trim()) {
      this.hashResult = '⚠️ Please enter some text';
      return;
    }

    logEvent(this.analytics, 'operation_tool', { item_name: 'hash', tool: this.selectedMethod, action: 'generate' });
    switch (this.selectedMethod) {
      case 'MD5':
        this.hashResult = CryptoJS.MD5(this.inputText).toString();
        break;
      case 'SHA-1':
        this.hashResult = CryptoJS.SHA1(this.inputText).toString();
        break;
      case 'SHA-256':
        this.hashResult = CryptoJS.SHA256(this.inputText).toString();
        break;
      case 'SHA-512':
        this.hashResult = CryptoJS.SHA512(this.inputText).toString();
        break;
      case 'bcrypt':
        const salt = await bcrypt.genSalt(10);
        this.hashResult = await bcrypt.hash(this.inputText, salt);
        break;
      default:
        this.hashResult = '❌ Unknown method';
    }
  }

  
  copyToClipboard() {
    navigator.clipboard.writeText(this.hashResult).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000); // hide after 2s
    });
  }

  clear() {
    this.inputText = '';
    this.hashResult = '';
  }

}
