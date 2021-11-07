import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChooseMonthComponent } from './choose-month.component';

describe('ChooseMonthComponent', () => {
  let component: ChooseMonthComponent;
  let fixture: ComponentFixture<ChooseMonthComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ChooseMonthComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
