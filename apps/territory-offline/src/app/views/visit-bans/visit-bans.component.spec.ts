import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitBansComponent } from './visit-bans.component';

describe('VisitBansComponent', () => {
  let component: VisitBansComponent;
  let fixture: ComponentFixture<VisitBansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitBansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitBansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
