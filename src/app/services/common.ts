import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Common {

  formatNestedJsonToText(
    jsonObject: object | unknown[],
    indentation = ''
  ): string {
    if (typeof jsonObject !== 'object' || jsonObject === null) {
      throw new Error('Invalid input type. Expected an object or array.');
    }

    let result = '';

    const entries = Array.isArray(jsonObject)
      ? jsonObject.map((value, index) => [String(index), value])
      : Object.entries(jsonObject);

    for (const [key, value] of entries) {
      const isObject = typeof value === 'object' && value !== null;
      const isArray = Array.isArray(value);

      result += `${indentation}${key}: `;

      if (isObject) {
        result += '\n';
        result += this.formatNestedJsonToText(value, indentation + '  ');
      } else if (isArray) {
        result += '\n';
        const arrayText = value
          .map((item) => this.formatNestedJsonToText(item, indentation + '  '))
          .join(',\n');
        result += `[${arrayText}]\n`;
      } else {
        result += `${value}\n`;
      }
    }

    return result;
  }

  splitMsg(logText: string): any {
    const cleaned = logText.replace(/\\u003c/g, '<').replace(/\\u003e/g, '>');

    const result: any = {};

    // Extract response JSON
    const responseMatch = cleaned.match(/response:\s*(\{.*?\})(?:,|$)/s);
    if (responseMatch) {
      try {
        result.response = JSON.parse(responseMatch[1]);
      } catch {
        // Fallback: try to sanitize before parsing
        const sanitized = responseMatch[1].replace(/\\"/g, '"').replace(/\\"/g, '"');
        try {
          result.response = JSON.parse(sanitized);
        } catch {
          result.response = responseMatch[1];
        }
      }
    }

    // Extract request block
    const requestMatch = cleaned.match(/request:\s*[&{]*(POST|GET|PUT|DELETE|PATCH)\s+([^\s]+)(.*?)$/s);
    if (requestMatch) {
      const [_, method, url, rest] = requestMatch;
      result.request = { method, url };

      // Extract host (by domain)
      const hostMatch = url.match(/https?:\/\/([^\/]+)/);
      if (hostMatch) result.request.host = hostMatch[1];

      // Try to extract headers (Go-style map[...] or JSON-like)
      const headersMatch = rest.match(/map\[([^\]]+)\]/);
      if (headersMatch) {
        const headerStr = headersMatch[1];
        const headers: any = {};
        headerStr.split(' ').forEach(pair => {
          const [key, val] = pair.split(':');
          if (key && val) headers[key.trim()] = val.replace(/\[|\]|,/g, '').trim();
        });
        result.request.headers = headers;
      }
    }

    // Extract message before "response:" or "request:"
    const msgMatch = cleaned.match(/^(.*?)\s*(response|request):/s);
    if (msgMatch) {
      result.msg = msgMatch[1].trim();
    } else {
      result.msg = cleaned.trim();
    }

    return result;
  }

}