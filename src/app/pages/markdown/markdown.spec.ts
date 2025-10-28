import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkdownPageComponent } from './markdown';

describe('MarkdownPageComponent', () => {
  let component: MarkdownPageComponent;
  let fixture: ComponentFixture<MarkdownPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the page component', () => {
    expect(component).toBeTruthy();
  });

  it('should render markdown tool', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-markdown')).toBeTruthy();
  });
});
