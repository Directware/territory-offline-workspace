import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDurationStepComponent } from './change-duration-step.component';

describe('ChangeDurationStepComponent', () => {
  let component: ChangeDurationStepComponent;
  let fixture: ComponentFixture<ChangeDurationStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeDurationStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDurationStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
