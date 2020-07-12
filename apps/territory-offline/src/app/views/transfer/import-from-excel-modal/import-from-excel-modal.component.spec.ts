import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFromExcelModalComponent } from './import-from-excel-modal.component';

describe('ImportFromExcelModalComponent', () => {
  let component: ImportFromExcelModalComponent;
  let fixture: ComponentFixture<ImportFromExcelModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportFromExcelModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFromExcelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
