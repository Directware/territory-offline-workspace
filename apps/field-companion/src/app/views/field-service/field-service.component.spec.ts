import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FieldServiceComponent } from './field-service.component';

describe('FieldServiceComponent', () => {
  let component: FieldServiceComponent;
  let fixture: ComponentFixture<FieldServiceComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FieldServiceComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
