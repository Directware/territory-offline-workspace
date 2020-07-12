import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WholeVisitBansComponent } from './whole-visit-bans.component';

describe('WholeVisitBansComponent', () => {
  let component: WholeVisitBansComponent;
  let fixture: ComponentFixture<WholeVisitBansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WholeVisitBansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WholeVisitBansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
