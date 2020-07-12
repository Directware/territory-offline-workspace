import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintTerritoryComponent } from './print-territory.component';

describe('PrintTerritoryComponent', () => {
  let component: PrintTerritoryComponent;
  let fixture: ComponentFixture<PrintTerritoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintTerritoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintTerritoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
