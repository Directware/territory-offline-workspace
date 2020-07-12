import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintTerritoryHeadingComponent } from './print-territory-heading.component';

describe('PrintTerritoryHeadingComponent', () => {
  let component: PrintTerritoryHeadingComponent;
  let fixture: ComponentFixture<PrintTerritoryHeadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintTerritoryHeadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintTerritoryHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
