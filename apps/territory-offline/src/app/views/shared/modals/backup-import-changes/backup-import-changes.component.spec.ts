import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupImportChangesComponent } from './backup-import-changes.component';

describe('BackupImportChangesComponent', () => {
  let component: BackupImportChangesComponent;
  let fixture: ComponentFixture<BackupImportChangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackupImportChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupImportChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
