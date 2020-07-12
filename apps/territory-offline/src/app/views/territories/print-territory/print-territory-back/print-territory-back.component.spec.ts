import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintTerritoryBackComponent } from './print-territory-back.component';

describe('PrintTerritoryBackComponent', () => {
  let component: PrintTerritoryBackComponent;
  let fixture: ComponentFixture<PrintTerritoryBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintTerritoryBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintTerritoryBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
