import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VisitBanManualChooserComponent } from './visit-ban-manual-chooser.component';

describe('VisitBanManualChooserComponent', () => {
  let component: VisitBanManualChooserComponent;
  let fixture: ComponentFixture<VisitBanManualChooserComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [VisitBanManualChooserComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitBanManualChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
