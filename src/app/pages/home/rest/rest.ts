import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Common } from '../../../services/common';
import { Analytics, logEvent } from '@angular/fire/analytics';

export interface RestRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | string;
  bodyType?: 'json' | 'form-data' | 'x-www-form-urlencoded' | 'raw' | 'binary' | 'none';
  body?: Record<string, any> | string;
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number>;
  auth?: { type: 'basic' | 'bearer' | 'apikey', user?: string, pass?: string, token?: string, key?: string, value?: string };
  cookies?: Record<string, string>;
  timeout?: number; // in seconds
  followRedirects?: boolean;
  proxy?: string;
  isBypassHttps?: boolean; // insecure SSL
}
@Component({
  selector: 'app-rest',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule
  ],
  templateUrl: './rest.html',
  styleUrl: './rest.scss'
})
export class RestTabComponent {

  private analytics = inject(Analytics);
  private common = inject(Common);
  active = 1;

  rawCurl: string = '';
  formattedRest: string = '';
  formattedCurl: string = '';

  restForm: FormGroup;
  copied = false;

  constructor(private fb: FormBuilder) {
    this.restForm = this.fb.group({
      url: [''],
      method: ['GET'],
      headers: this.fb.array([]),
      queryParams: this.fb.array([]),
      bodyType: ['json'],
      body: [''],
      isBypassHttps: [false]
    });
  }

  get headers(): FormArray {
    return this.restForm.get('headers') as FormArray;
  }

  get queryParams(): FormArray {
    return this.restForm.get('queryParams') as FormArray;
  }

  addHeader() {
    this.headers.push(this.fb.group({ key: [''], value: [''] }));
  }

  removeHeader(i: number) {
    this.headers.removeAt(i);
  }

  addQueryParam() {
    this.queryParams.push(this.fb.group({ key: [''], value: [''] }));
  }

  removeQueryParam(i: number) {
    this.queryParams.removeAt(i);
  }

  curl() {
    logEvent(this.analytics, 'operation_tool', { item_name: 'rest', tool: 'curl', action: 'generate' });
    const { url, method, headers, queryParams, bodyType, body, isBypassHttps } = this.restForm.value;

    let curl = `curl -X ${method.toUpperCase()}`;

    // bypass https
    if (isBypassHttps) curl += ' -k';

    // headers
    headers.forEach((h: any) => {
      if (h.key && h.value) curl += ` -H "${h.key}: ${h.value}"`;
    });

    // query params
    let finalUrl = url;
    if (queryParams.length > 0) {
      const q = queryParams
        .filter((qp: any) => qp.key && qp.value)
        .map((qp: any) => `${encodeURIComponent(qp.key)}=${encodeURIComponent(qp.value)}`)
        .join('&');
      finalUrl += (url.includes('?') ? '&' : '?') + q;
    }

    // body
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
      if (bodyType === 'json') {
        curl += ` -H "Content-Type: application/json" -d '${body}'`;
      } else if (bodyType === 'form-data') {
        try {
          const form = JSON.parse(body);
          Object.keys(form).forEach(k => {
            curl += ` -F "${k}=${form[k]}"`;
          });
        } catch {
          curl += ` -F "${body}"`;
        }
      } else if (bodyType === 'x-www-form-urlencoded') {
        try {
          const form = JSON.parse(body);
          const encoded = Object.keys(form)
            .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(form[k])}`)
            .join('&');
          curl += ` -H "Content-Type: application/x-www-form-urlencoded" -d "${encoded}"`;
        } catch {
          curl += ` -d "${body}"`;
        }
      }
    }

    curl += ` "${finalUrl}"`;

    this.formattedRest = curl;
  }

  convertHttpTextToCurl() {
    const lines = this.rawCurl.trim().split(/\r?\n/);
    if (lines.length > 0) {

      // --- Find request line ---
      const requestLine = lines[0];
      const requestMatch = requestLine.match(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+(\S+)(?:\s+HTTP\/[\d.]+)?$/i);
      if (!requestMatch) {
        this.formattedCurl = '# Invalid HTTP request format';
        return
      }

      const method = requestMatch[1].toUpperCase();
      let url = requestMatch[2];

      // If "Host:" header is in lines, prepend it if URL is relative
      let host = '';
      const headers: Record<string, string> = {};
      let body = '';
      let isBody = false;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        if (line.trim() === '') {
          isBody = true;
          continue;
        }

        if (!isBody) {
          const headerMatch = line.match(/^([\w-]+):\s*(.*)$/);
          if (headerMatch) {
            const key = headerMatch[1];
            const value = headerMatch[2];
            headers[key.toLowerCase()] = value;
            if (key.toLowerCase() === 'host') {
              host = value;
            }
          }
        } else {
          body += (body ? '\n' : '') + line;
        }
      }

      // If url is relative, use host
      if (!/^https?:\/\//i.test(url)) {
        url = `http${host.includes('localhost') ? '' : 's'}://${host}${url.startsWith('/') ? '' : '/'}${url}`;
      }

      // --- Start building curl ---
      let curl = `curl -X ${method} '${url}'`;

      // Add headers
      for (const [key, value] of Object.entries(headers)) {
        curl += ` \\\n  -H '${key}: ${value}'`;
      }

      // Add body if present
      if (body.trim()) {
        // Escape single quotes in body
        const escapedBody = body.replace(/'/g, `'\\''`);
        curl += ` \\\n  -d '${escapedBody}'`;
      }

      this.formattedCurl = curl;
    }
  }

  parsePostmanFormat(): RestRequest {
    const result: RestRequest = { url: '', method: 'GET', headers: {} };

    // match url
    const urlMatch = this.rawCurl.match(/'(https?:\/\/[^\s']+)'/);
    if (urlMatch) {
      const rawUrl = urlMatch[1];
      const [base, query] = rawUrl.split('?');
      result.url = base;
      if (query) {
        result.queryParams = {};
        query.split('&').forEach(q => {
          const [k, v] = q.split('=');
          result.queryParams![decodeURIComponent(k)] = decodeURIComponent(v);
        });
      }
    }

    // detect method
    if (/--request\s+(\w+)/i.test(this.rawCurl)) {
      result.method = RegExp.$1.toUpperCase();
    } else if (/--data|--data-raw/.test(this.rawCurl)) {
      result.method = 'POST';
    }

    // headers
    const headerRegex = /--header\s+'([^:]+):\s*([^']+)'/g;
    let m;
    while ((m = headerRegex.exec(this.rawCurl)) !== null) {
      result.headers![m[1].trim()] = m[2].trim();
    }

    // body
    const dataMatch = this.rawCurl.match(/--data-raw\s+'([^']+)'/);
    if (dataMatch) {
      try {
        result.body = JSON.parse(dataMatch[1]);
        result.bodyType = 'json';
      } catch {
        result.body = dataMatch[1];
        result.bodyType = 'raw';
      }
    }

    // flags
    result.followRedirects = /--location/.test(this.rawCurl);
    result.isBypassHttps = /--insecure|-k/.test(this.rawCurl);

    const timeoutMatch = this.rawCurl.match(/--max-time\s+(\d+)/);
    if (timeoutMatch) {
      result.timeout = parseInt(timeoutMatch[1], 10);
    }

    return result;
  }

  parseStandardFormat(): RestRequest {
    const result: RestRequest = { url: '', method: 'GET', headers: {} };

    // match url (last quoted string is usually URL)
    const urlMatches = this.rawCurl.match(/'([^']+)'|"([^"]+)"|(\S+$)/g);
    if (urlMatches) {
      const rawUrl = urlMatches[urlMatches.length - 1].replace(/^['"]|['"]$/g, '');
      const [base, query] = rawUrl.split('?');
      result.url = base;
      if (query) {
        result.queryParams = {};
        query.split('&').forEach(q => {
          const [k, v] = q.split('=');
          result.queryParams![decodeURIComponent(k)] = decodeURIComponent(v || '');
        });
      }
    }

    // method (-X or default POST if data present)
    const methodMatch = this.rawCurl.match(/-X\s+(\w+)/i);
    if (methodMatch) {
      result.method = methodMatch[1].toUpperCase();
    } else if (/--data|-d/.test(this.rawCurl)) {
      result.method = 'POST';
    }

    // headers
    const headerRegex = /-H\s+'([^:]+):\s*([^']+)'/g;
    let m;
    while ((m = headerRegex.exec(this.rawCurl)) !== null) {
      result.headers![m[1].trim()] = m[2].trim();
    }

    // body (-d or --data)
    const dataMatch = this.rawCurl.match(/(--data|-d|--data-raw)\s+'([^']+)'/);
    if (dataMatch) {
      try {
        result.body = JSON.parse(dataMatch[2]);
        result.bodyType = 'json';
      } catch {
        result.body = dataMatch[2];
        result.bodyType = 'raw';
      }
    }

    // cookies (-b)
    const cookieMatch = this.rawCurl.match(/-b\s+"([^"]+)"/);
    if (cookieMatch) {
      result.cookies = {};
      cookieMatch[1].split(';').forEach(c => {
        const [k, v] = c.split('=');
        result.cookies![k.trim()] = (v || '').trim();
      });
    }

    // flags
    result.followRedirects = /-L/.test(this.rawCurl);
    result.isBypassHttps = /--insecure|-k/.test(this.rawCurl);

    // timeout
    const timeoutMatch = this.rawCurl.match(/--max-time\s+(\d+)/);
    if (timeoutMatch) {
      result.timeout = parseInt(timeoutMatch[1], 10);
    }

    // proxy
    const proxyMatch = this.rawCurl.match(/--proxy\s+(\S+)/);
    if (proxyMatch) {
      result.proxy = proxyMatch[1];
    }

    return result;
  }


  async json() {
    try {
      const urlMatch = this.rawCurl.match(/'(https?:\/\/[^\s']+)'/);
      if (urlMatch) {
        logEvent(this.analytics, 'operation_tool', { item_name: 'rest', tool: 'json', action: 'postman_format' });
        console.log("curlPostmanFormat");
        this.formattedCurl = JSON.stringify(await this.parsePostmanFormat(), null, 2);
      } else {
        logEvent(this.analytics, 'operation_tool', { item_name: 'rest', tool: 'json', action: 'standard_format' });
        console.log("curlStandardFormat");
        this.formattedCurl = JSON.stringify(await this.parseStandardFormat(), null, 2);
      }

    } catch (e) {
      this.formattedCurl = '❌ Invalid JSON';
    }

  }

  async normalize() {
    try {
      const urlMatch = this.rawCurl.match(/'(https?:\/\/[^\s']+)'/);
      if (urlMatch) {
        logEvent(this.analytics, 'operation_tool', { item_name: 'rest', tool: 'normalize', action: 'postman_format' });
        console.log("curlPostmanFormat");
        const parseRawCurl = await this.parsePostmanFormat();
        this.formattedCurl = this.common.formatNestedJsonToText(parseRawCurl);
      } else {
        logEvent(this.analytics, 'operation_tool', { item_name: 'rest', tool: 'normalize', action: 'standard_format' });
        console.log("curlStandardFormat");
        const parseRawCurl = await this.parseStandardFormat();
        this.formattedCurl = this.common.formatNestedJsonToText(parseRawCurl);
      }

    } catch (e) {
      this.formattedCurl = '❌ Invalid JSON';
    }
  }

  copyToClipboard(type: string) {
    navigator.clipboard.writeText(type === 'curl' ? this.formattedCurl : this.formattedRest).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000); // hide after 2s
    });
  }
}
