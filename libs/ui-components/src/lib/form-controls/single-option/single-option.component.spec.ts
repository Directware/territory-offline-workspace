import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SingleOptionComponent } from './single-option.component';

describe('DatePickerComponent', () => {
  let component: SingleOptionComponent;
  let fixture: ComponentFixture<SingleOptionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SingleOptionComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
