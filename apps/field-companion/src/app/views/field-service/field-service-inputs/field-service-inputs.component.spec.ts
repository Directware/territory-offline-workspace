import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldServiceInputsComponent } from './field-service-inputs.component';

describe('FieldServiceInputsComponent', () => {
  let component: FieldServiceInputsComponent;
  let fixture: ComponentFixture<FieldServiceInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldServiceInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldServiceInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
