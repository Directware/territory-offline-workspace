import {async, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({})
}));

jest.mock('@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js', () => ({
  MapboxGeocoder: () => ({})
}));

jest.mock("uuid", () => "");

describe('AppComponent', () =>
{
  beforeEach(async(() =>
  {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: []
    }).compileComponents();
  }));

  it('should create the app', () =>
  {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
  /*

  it(`should have as title 'territory-offline-v2'`, () =>
  {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('territory-offline-v2');
  });

  it('should render title', () =>
  {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('territory-offline-v2 app is running!');
  });
  */
});
