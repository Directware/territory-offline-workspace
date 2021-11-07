import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditReportBeforeSendComponent } from './edit-report-before-send.component';

describe('EditReportBeforeSendComponent', () => {
  let component: EditReportBeforeSendComponent;
  let fixture: ComponentFixture<EditReportBeforeSendComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EditReportBeforeSendComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReportBeforeSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
