import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { FormsModule } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import * as QRCode from 'qrcode';
import QrScanner from 'qr-scanner';

@Component({
  selector: 'app-qrcode',
  imports: [
    CommonModule,
    FormsModule,
    NgbNavModule
  ],
  templateUrl: './qrcode.html',
  styleUrl: './qrcode.scss'
})
export class QRCodeTabComponent {
  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  private analytics = inject(Analytics);
  
  // Generator properties
  inputText = '';
  qrCodeDataURL = '';
  generatedQRCode = '';
  copied = false;
  
  // Scanner properties
  scannedResult = '';
  scanError = '';
  scanStatus = '';
  isProcessing = false;
  
  // Active tab
  active = 1; // 1 = Generator, 2 = Scanner

  async generateQRCode() {
    if (!this.inputText.trim()) {
      this.generatedQRCode = '⚠️ Please enter some text to generate QR code';
      return;
    }

    try {
      logEvent(this.analytics, 'operation_tool', { item_name: 'qrcode', tool: 'generator', action: 'generate' });
      
      // Generate QR code as data URL
      this.qrCodeDataURL = await QRCode.toDataURL(this.inputText, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      this.generatedQRCode = 'QR Code generated successfully!';
      this.copied = false;
    } catch (error) {
      console.error('Error generating QR code:', error);
      this.generatedQRCode = '❌ Error generating QR code';
    }
  }

  async downloadQRCode() {
    if (!this.qrCodeDataURL) {
      return;
    }

    try {
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = this.qrCodeDataURL;
      link.click();
      
      logEvent(this.analytics, 'operation_tool', { item_name: 'qrcode', tool: 'generator', action: 'download' });
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  }



  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.scanFromFile(file);
    }
  }

  async scanFromFile(file: File) {
    try {
      this.scanError = '';
      this.scannedResult = '';
      
      const result = await QrScanner.scanImage(file);
      this.scannedResult = result;
      logEvent(this.analytics, 'operation_tool', { item_name: 'qrcode', tool: 'scanner', action: 'scan_file' });
    } catch (error) {
      console.error('Error scanning QR code from file:', error);
      this.scanError = 'No QR code found in the selected image.';
    }
  }

  clearGenerator() {
    this.inputText = '';
    this.generatedQRCode = '';
    this.qrCodeDataURL = '';
    this.copied = false;
  }

  clearScanner() {
    this.scannedResult = '';
    this.scanError = '';
    this.scanStatus = '';
    this.isProcessing = false;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    });
  }


}