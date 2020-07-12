import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSearchComponent } from './language-search.component';

describe('LanguageSearchComponent', () => {
  let component: LanguageSearchComponent;
  let fixture: ComponentFixture<LanguageSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
