import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoryHelperImportComponent } from './territory-helper-import.component';

describe('TerritoryHelperImportComponent', () => {
  let component: TerritoryHelperImportComponent;
  let fixture: ComponentFixture<TerritoryHelperImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerritoryHelperImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryHelperImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
