import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GoalsInputComponent } from './goals-input.component';

describe('GoalsInputComponent', () => {
  let component: GoalsInputComponent;
  let fixture: ComponentFixture<GoalsInputComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GoalsInputComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
