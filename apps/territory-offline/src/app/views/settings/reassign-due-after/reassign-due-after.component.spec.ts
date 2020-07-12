import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignDueAfterComponent } from './reassign-due-after.component';

describe('ReassignDueAfterComponent', () => {
  let component: ReassignDueAfterComponent;
  let fixture: ComponentFixture<ReassignDueAfterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReassignDueAfterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassignDueAfterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
