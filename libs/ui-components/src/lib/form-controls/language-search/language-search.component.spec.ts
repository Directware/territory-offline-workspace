import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LanguageSearchComponent } from './language-search.component';

describe('LanguageSearchComponent', () => {
  let component: LanguageSearchComponent;
  let fixture: ComponentFixture<LanguageSearchComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LanguageSearchComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
