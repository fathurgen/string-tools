import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Common } from '../../../services/common';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Component({
  selector: 'app-json',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './json.html',
  styleUrl: './json.scss'
})
export class JsonTabComponent implements OnInit {
  private analytics = inject(Analytics);
  private common = inject(Common);
  exampleDeepJsonString: string = "";
  exampleDeepJson = {"id":1,"name":"adul","data":"{\"createdBy\":\"admin\",\"createdAt\":\"2023-10-03T10:00:00Z\",\"tags\":[\"angular\",\"json\"]}"}
  
  copied = false;

  constructor() {
    // Store component instance for access from other components
    (window as any).jsonComponent = this;
    this.exampleDeepJsonString = JSON.stringify(this.exampleDeepJson, null, 2);
  }

  ngOnInit() {
    // Add beforeunload event listener
    window.addEventListener('beforeunload', this.beforeUnloadHandler.bind(this));
  }

  ngOnDestroy() {
    // Clean up
    window.removeEventListener('beforeunload', this.beforeUnloadHandler.bind(this));
    (window as any).jsonComponent = null;
  }

  private beforeUnloadHandler(event: BeforeUnloadEvent) {
    if (this.rawJson) {
      event.preventDefault();
      event.returnValue = '';
      return '';
    }
    return undefined;
  }

  rawJson = '';
  formattedJson = '';

  beautify() {
    logEvent(this.analytics, 'operation_tool', { item_name: 'json', tool: 'beautify', action: 'beautify' });
    try {
      this.formattedJson = JSON.stringify(JSON.parse(this.rawJson), null, 2);
    } catch (e) {
      this.formattedJson = '❌ Invalid JSON';
    }
  }

  minify() {
    logEvent(this.analytics, 'operation_tool', { item_name: 'json', tool: 'minify', action: 'minify' });
    try {
      this.formattedJson = JSON.stringify(JSON.parse(this.rawJson));
    } catch (e) {
      this.formattedJson = '❌ Invalid JSON';
    }
  }

  normalize() {
    logEvent(this.analytics, 'operation_tool', { item_name: 'json', tool: 'normalize', action: 'normalize' });
    try {
      this.formattedJson = this.common.formatNestedJsonToText(JSON.parse(this.rawJson));
    } catch (e) {
      this.formattedJson = '❌ Invalid JSON';
    }
  }

  async deepNormalize() {
    logEvent(this.analytics, 'operation_tool', { item_name: 'json', tool: 'deepNormalize', action: 'deepNormalize' });
    try {
      await this.format();
      this.formattedJson = this.common.formatNestedJsonToText(this.formattedJson ? JSON.parse(this.formattedJson) : {});
    } catch (e) {
      this.formattedJson = '❌ Invalid JSON';
    }
  }

  format() {
    logEvent(this.analytics, 'operation_tool', { item_name: 'json', tool: 'format', action: 'format' });
    try {
      const parsed = JSON.parse(this.rawJson);
      const unwrapped = this.deepUnwrap(parsed);
      this.formattedJson = JSON.stringify(unwrapped, null, 2);
    } catch (e) {
      this.formattedJson = '❌ Invalid JSON';
    }
  }

  xml() {
    logEvent(this.analytics, 'operation_tool', { item_name: 'json', tool: 'xml', action: 'xml' });
    try {
      // gunakan formattedJson yang sudah di-unwrap, atau parse kembali dari raw
      const parsed = typeof this.rawJson === 'string'
        ? JSON.parse(this.rawJson)
        : this.rawJson;

      this.formattedJson = this.jsonToXml(parsed, 'logEntry'); // ganti root name kalau mau
    } catch (e) {
      this.formattedJson = '❌ Cannot convert to XML: invalid JSON';
    }
  }
  

  async deepXml() {
    logEvent(this.analytics, 'operation_tool', { item_name: 'json', tool: 'deepXml', action: 'deepXml' });
    try {
      await this.format();
      const parsed = typeof this.formattedJson === 'string'
        ? JSON.parse(this.formattedJson)
        : this.formattedJson;

      this.formattedJson = this.jsonToXml(parsed, 'logEntry'); // ganti root name kalau mau
    } catch (e) {
      this.formattedJson = '❌ Cannot convert to XML: invalid JSON';
    }
  }

  // split function ---------------------------------
  tryParseJson(str: string): any {
    try {
      return JSON.parse(str);
    } catch {
      return str; // bukan JSON string
    }
  }

  deepUnwrap(obj: any): any {
  if (typeof obj === 'string') {
    // Try to parse full JSON string
    try {
      return this.deepUnwrap(JSON.parse(obj));
    } catch {
      // Detect log-like messages containing response/request
      
      const structuredPattern = /(response|request|payload|body|data|result|details):\s*(\{|\[|&\{)/i;
      if (structuredPattern.test(obj)) {
        return this.common.splitMsg(obj);
      }
      return obj;
    }
  }

  if (Array.isArray(obj)) {
    return obj.map(item => this.deepUnwrap(item));
  }

  if (obj !== null && typeof obj === 'object') {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      result[key] = this.deepUnwrap(obj[key]);
    }
    return result;
  }

  return obj;
}

  /**
 * Extracts structured `response` and `request` from log message
 * and keeps the remaining message as `msg`.
 */


  jsonToXml(obj: any, rootName = 'root'): string {
    // If user passed already a primitive, wrap it
    if (obj === null || typeof obj !== 'object') {
      return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>${this.primitiveToText(obj)}</${rootName}>`;
    }

    const children = Object.keys(obj)
      .map(k => this.jsonToXmlNode(k, obj[k], '  '))
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${children}\n</${rootName}>`;
  }

  escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // convert primitive to text
  primitiveToText(value: any): string {
    if (value === null) return '';
    if (typeof value === 'string') return this.escapeXml(value);
    return this.escapeXml(String(value));
  }

  // recursive converter
  jsonToXmlNode(key: string, value: any, indent = ''): string {
    const nextIndent = indent + '  ';

    // Arrays: repeat tag for every item
    if (Array.isArray(value)) {
      return value.map(item => this.jsonToXmlNode(key, item, indent)).join('\n');
    }

    // Objects: open tag, render children, close tag
    if (value !== null && typeof value === 'object') {
      const children = Object.keys(value)
        .map(k => this.jsonToXmlNode(k, value[k], nextIndent))
        .join('\n');

      // jika object kosong -> self-closing tag
      if (!children) {
        return `${indent}<${key} />`;
      }

      return `${indent}<${key}>\n${children}\n${indent}</${key}>`;
    }

    // Primitive
    return `${indent}<${key}>${this.primitiveToText(value)}</${key}>`;
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.formattedJson).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000); // hide after 2s
    });
  }

  clear(){
    this.rawJson = '';
    this.formattedJson = '';
  }

}
