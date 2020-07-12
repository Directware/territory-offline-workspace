import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueAssignmentsComponent } from './overdue-assignments.component';

describe('OverdueAssignmentsComponent', () => {
  let component: OverdueAssignmentsComponent;
  let fixture: ComponentFixture<OverdueAssignmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdueAssignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdueAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
