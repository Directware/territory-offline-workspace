import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StackPanelComponent } from './stack-panel.component';

describe('StackPanelComponent', () => {
  let component: StackPanelComponent;
  let fixture: ComponentFixture<StackPanelComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StackPanelComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StackPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
