import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { App } from '../../app';
import { routes } from '../../app.routes';

describe('Markdown Previewer E2E', () => {
  let fixture: ComponentFixture<App>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), App]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(App);
  });

  const bootstrapApp = () => {
    router.initialNavigation();
    tick();
    fixture.detectChanges();
  };

  it('should navigate to markdown page from navbar link', fakeAsync(() => {
    bootstrapApp();
    const markdownLink = fixture.nativeElement.querySelector('a[routerlink="/markdown"]') as HTMLAnchorElement;
    expect(markdownLink).toBeTruthy();

    markdownLink.click();
    tick();
    fixture.detectChanges();

    expect(router.url).toBe('/markdown');
    const heading = fixture.nativeElement.querySelector('h2');
    expect(heading?.textContent).toContain('Markdown Previewer');
  }));

  it('should update preview when user types markdown', fakeAsync(() => {
    bootstrapApp();
    router.navigateByUrl('/markdown');
    tick();
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('textarea#markdown-input') as HTMLTextAreaElement;
    expect(textarea).toBeTruthy();

    textarea.value = '# Hello';
    textarea.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();

    const preview = fixture.nativeElement.querySelector('.preview');
    expect(preview?.innerHTML).toContain('<h1');
    expect(preview?.innerHTML).toContain('Hello');
  }));
});
