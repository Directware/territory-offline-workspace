import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportReportForGroupOverseerComponent } from './export-report-for-group-overseer.component';

describe('ExportReportForGroupOverseerComponent', () => {
  let component: ExportReportForGroupOverseerComponent;
  let fixture: ComponentFixture<ExportReportForGroupOverseerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportReportForGroupOverseerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportReportForGroupOverseerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
