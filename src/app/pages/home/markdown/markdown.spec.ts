import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { MarkdownTabComponent } from './markdown';
import { MarkdownService } from '../../../services/markdown.service';

class MarkdownServiceStub {
  parse = jasmine.createSpy('parse').and.callFake((value: string) => {
    if (!value.trim()) {
      return '';
    }
    return `<p>${value}</p>`;
  });
}

describe('MarkdownTabComponent', () => {
  let component: MarkdownTabComponent;
  let fixture: ComponentFixture<MarkdownTabComponent>;
  let originalClipboard: Clipboard | undefined;
  let hadClipboardProperty: boolean;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownTabComponent],
      providers: [{ provide: MarkdownService, useClass: MarkdownServiceStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    hadClipboardProperty = Object.prototype.hasOwnProperty.call(navigator, 'clipboard');
    originalClipboard = navigator.clipboard;
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true
    });

    if (!hadClipboardProperty) {
      delete (navigator as unknown as Record<string, unknown>)['clipboard'];
    }
  });

  it('should render markdown preview when input changes', () => {
    component.onInput('# Heading');
    fixture.detectChanges();

    const service = TestBed.inject(MarkdownService) as unknown as MarkdownServiceStub;
    expect(service.parse).toHaveBeenCalledWith('# Heading');
    expect(component.renderedHtml).toContain('# Heading');
  });

  it('should clear markdown and preview', () => {
    component.onInput('Content');
    component.clear();
    fixture.detectChanges();

    expect(component.markdownText).toBe('');
    expect(component.renderedHtml).toBe('');
    expect(component.copyState).toBe('idle');
  });

  it('should copy preview html when clipboard api is available', fakeAsync(async () => {
    const writeTextSpy = jasmine.createSpy('writeText').and.returnValue(Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextSpy },
      configurable: true
    });

    component.onInput('Copied');
    fixture.detectChanges();

    await component.copyPreview();
    flushMicrotasks();

    expect(writeTextSpy).toHaveBeenCalledWith('<p>Copied</p>');
    expect(component.copyState).toBe('success');
  }));
});
