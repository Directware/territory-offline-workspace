import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReportBeforeSendComponent } from './edit-report-before-send.component';

describe('EditReportBeforeSendComponent', () => {
  let component: EditReportBeforeSendComponent;
  let fixture: ComponentFixture<EditReportBeforeSendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditReportBeforeSendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReportBeforeSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
