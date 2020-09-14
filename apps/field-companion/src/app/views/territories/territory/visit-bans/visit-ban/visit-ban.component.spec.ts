import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitBanComponent } from './visit-ban.component';

describe('VisitBanComponent', () => {
  let component: VisitBanComponent;
  let fixture: ComponentFixture<VisitBanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitBanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitBanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
