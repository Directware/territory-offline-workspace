import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportGeoJsonComponent } from './import-geo-json.component';

describe('ImportGeoJsonComponent', () => {
  let component: ImportGeoJsonComponent;
  let fixture: ComponentFixture<ImportGeoJsonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportGeoJsonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportGeoJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
