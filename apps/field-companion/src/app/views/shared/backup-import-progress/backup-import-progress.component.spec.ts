import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BackupImportProgressComponent } from './backup-import-progress.component';

describe('BackupImportProgressComponent', () => {
  let component: BackupImportProgressComponent;
  let fixture: ComponentFixture<BackupImportProgressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BackupImportProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupImportProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
