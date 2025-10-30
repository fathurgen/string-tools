import { TestBed } from '@angular/core/testing';
import { marked } from 'marked';
import { MarkdownService } from './markdown.service';

describe('MarkdownService', () => {
  let service: MarkdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkdownService);
  });

  it('should return empty string when markdown is empty', () => {
    expect(service.parse('')).toBe('');
    expect(service.parse('   ')).toBe('');
  });

  it('should convert markdown to html', () => {
    const result = service.parse('# Title');
    expect(result).toContain('<h1');
    expect(result).toContain('Title');
  });

  it('should handle parser errors gracefully', () => {
    const parseSpy = spyOn(marked, 'parse').and.throwError('boom');
    const message = service.parse('**bold**');
    expect(parseSpy).toHaveBeenCalled();
    expect(message).toContain('Unable to render markdown preview');
  });
});
