import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportVisitBansFromExcelComponent } from './import-visit-bans-from-excel.component';

describe('ImportVisitBansFromExcelComponent', () => {
  let component: ImportVisitBansFromExcelComponent;
  let fixture: ComponentFixture<ImportVisitBansFromExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportVisitBansFromExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportVisitBansFromExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
