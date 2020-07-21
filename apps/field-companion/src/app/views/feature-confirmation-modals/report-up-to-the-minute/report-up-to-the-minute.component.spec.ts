import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportUpToTheMinuteComponent } from './report-up-to-the-minute.component';

describe('ReportUpToTheMinuteComponent', () => {
  let component: ReportUpToTheMinuteComponent;
  let fixture: ComponentFixture<ReportUpToTheMinuteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportUpToTheMinuteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportUpToTheMinuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
